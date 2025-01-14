package main

import (
	"encoding/json"
	"fmt"
	"strings"
	"sync"

	"time"

	regex "backend/Utils"
)

type Sign struct {
	Snils   string `json:"snils"`
	Name    string `json:"name"`
	Sha     string `json:"sha"`
	before  time.Time
	after   time.Time
	T       string `json:"t"`
	New     bool   `json:"new"`
	Double  bool   `json:"double"`
	Expired bool   `json:"expired"`
}

func Parse(input string) ([]byte, error) {
	match, err := regex.ErrorCode.FindStringMatch(input)
	if err != nil {
		return []byte{}, fmt.Errorf("%w", err)
	} else if match.String() != "0x00000000" {
		return []byte{}, fmt.Errorf("%s", match.String())
	}

	input_parts := regex.Splitter.Split(input, 3)

	raw_signs := regex.SplitterSigns.Split(strings.TrimSpace(input_parts[1]), -1)

	ch := make(chan Sign, len(raw_signs))

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

	var signs_list = []Sign{}

	for sign := range ch {
		signs_list = append(signs_list, sign)
	}

	sorted_map := make(map[string][]*Sign)

	for _, value := range signs_list {
		_, exists := sorted_map[value.Snils]
		if exists {
			sorted_map[value.Snils] = append(sorted_map[value.Snils], &value)
		} else {
			sorted_map[value.Snils] = []*Sign{&value}
		}
	}

	for _, value := range sorted_map {
		if len(value) == 1 {
			continue
		}

		latest := value[0]
		latest_time := 0

		for _, sign := range value {
			sign.Double = true

			if sign.after.Second() > latest_time {
				latest_time = sign.after.Second()
				latest = sign
			}
		}

		latest.New = true
	}

	jsonData, err := json.Marshal(signs_list)
	if err != nil {
		return []byte{}, fmt.Errorf("%s", err)
	}

	return jsonData, nil
}

func ParseSign(unparsed_sign string, ch chan Sign) {
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

	parsed_sign := Sign{
		Snils:   snils,
		Name:    name,
		Sha:     sha,
		before:  before,
		after:   after,
		T:       t,
		Double:  false,
		New:     false,
		Expired: time.Now().After(after),
	}

	ch <- parsed_sign
}
