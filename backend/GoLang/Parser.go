package main

import (
	"fmt"
	"os"
	"time"

	regex "golang-backend/Utils"
)

type Sign struct {
	snils  string
	name   string
	sha    string
	before time.Time
	after  time.Time
	t      string
	err    string
}

func Parse(input string) ([]string, string) {
	match, err := regex.ErrorCode.FindStringMatch(input)
	if err != nil {
		return []string{}, "Код ошибки не был найден"
	} else if match.String() != "0x00000000" {
		return []string{}, fmt.Sprintf("Ошибка %s", match.String())
	}

	input_parts := regex.Splitter.Split(input, 3)

	raw_signs := regex.SplitterSigns.Split(input_parts[1], -1)

	ch_in := make(chan string)
	defer close(ch_in)

	ch_out := make(chan *Sign)
	defer close(ch_out)

	for i := 0; i <= 3; i++ {
		go ParseSign(ch_in, ch_out)
	}

	// for _, value := range raw_signs {
	// 	ch_in <- value
	// }
	ch_in <- raw_signs[0]

	sign := <-ch_out
	fmt.Println(sign)

	return []string{}, ""

}

func ParseSign(ch_in chan string, ch_out chan *Sign) {
	for unparsed_sign := range ch_in {
		snils_match, _ := regex.Snils.FindStringMatch(unparsed_sign)
		var snils string
		if snils_match == nil {
			snils = "Обезличена"
		} else {
			snils = snils_match.String()
		}
		sha := regex.Sha.FindString(unparsed_sign)
		fmt.Println(sha)
		sn, _ := regex.Sn.FindStringMatch(unparsed_sign)
		g, _ := regex.G.FindStringMatch(unparsed_sign)
		t, _ := regex.T.FindStringMatch(unparsed_sign)

		dates := regex.Date.FindAllString(unparsed_sign, 2)
		before, _ := time.Parse(regex.TimeLayout, dates[0])
		after, _ := time.Parse(regex.TimeLayout, dates[1])

		var name string
		if sn == nil && g == nil {
			name = "Обезличена"
		} else {
			name = sn.String() + " " + g.String()
		}

		parsed_sign := &Sign{
			snils: snils,
			name:  name,
			// sha:    sha.String(),
			before: before,
			after:  after,
			t:      t.String(),
		}

		ch_out <- parsed_sign
		return
	}
}

func main() {
	data, _ := os.ReadFile("signs.txt")
	match, err := Parse(string(data))
	fmt.Println(len(match), err)
}
