package main

import (
	"fmt"
	"os"
	"strings"
	"sync"

	"time"

	regex "backend/Utils"
)

type Sign struct {
	snils  string
	name   string
	sha    string
	before time.Time
	after  time.Time
	t      string
	new    bool
	double bool
}

func Parse(input string) ([]string, string) {
	match, err := regex.ErrorCode.FindStringMatch(input)
	if err != nil {
		return []string{}, "Код ошибки не был найден"
	} else if match.String() != "0x00000000" {
		return []string{}, fmt.Sprintf("Ошибка %s", match.String())
	}

	input_parts := regex.Splitter.Split(input, 3)

	raw_signs := regex.SplitterSigns.Split(strings.TrimSpace(input_parts[1]), -1)

	ch := make(chan *Sign, len(raw_signs))

	var wg sync.WaitGroup

	for _, raw_sign := range raw_signs {
		if len(raw_sign) > 0 {
			wg.Add(1)
			go func(raw_sign string) {
				defer wg.Done()
				ParseSign(raw_sign, ch)
			}(raw_sign)
		}
	}

	go func() {
		wg.Wait()
		close(ch)
	}()

	var signs_list = []*Sign{}

	for sign := range ch {
		signs_list = append(signs_list, sign)
	}

	return []string{}, ""

}

func ParseSign(unparsed_sign string, ch chan *Sign) {
	snils_match, _ := regex.Snils.FindStringMatch(unparsed_sign)
	var snils string
	if snils_match == nil {
		snils = "Обезличена"
	} else {
		snils = snils_match.String()
	}
	sha := regex.Sha.FindString(unparsed_sign)
	sn, _ := regex.Sn.FindStringMatch(unparsed_sign)
	g, _ := regex.G.FindStringMatch(unparsed_sign)
	t_match, _ := regex.T.FindStringMatch(unparsed_sign)

	dates := regex.Date.FindAllString(unparsed_sign, 2)
	before, _ := time.Parse(regex.TimeLayout, dates[0])
	after, _ := time.Parse(regex.TimeLayout, dates[1])

	var name string
	if sn == nil && g == nil {
		name = "Обезличена"
	} else if sn == nil {
		name = g.String()
	} else if g == nil {
		name = sn.String()
	} else {
		name = sn.String() + " " + g.String()
	}

	var t string
	if t_match == nil {
		t = ""
	} else {
		t = t_match.String()
	}

	parsed_sign := &Sign{
		snils:  snils,
		name:   name,
		sha:    sha,
		before: before,
		after:  after,
		t:      t,
	}

	ch <- parsed_sign
}

func main() {
	data, _ := os.ReadFile("signs.txt")
	match, err := Parse(string(data))
	fmt.Println(len(match), err)
}
