package regex

import (
	"regexp"

	"github.com/dlclark/regexp2"
)

func CompileRegex(pattern string) *regexp2.Regexp {
	regex := regexp2.MustCompile(pattern, 0)
	return regex
}

var (
	ErrorCode     *regexp2.Regexp
	Snils         *regexp2.Regexp
	Sha           *regexp.Regexp
	Sn            *regexp2.Regexp
	G             *regexp2.Regexp
	T             *regexp2.Regexp
	Date          *regexp.Regexp
	Splitter      *regexp.Regexp
	SplitterSigns *regexp.Regexp
)

const TimeLayout = "02/01/2006  15:04:05 MST"

func init() {
	ErrorCode = CompileRegex(`(?<=\[ErrorCode:\s)\dx\w{8}(?=\])`)

	Snils = CompileRegex(`(?<=(SNILS|СНИЛС)=)\d+`)
	Sha = regexp.MustCompile(`\w{40}`)
	Sn = CompileRegex(`(?<=SN=)\w+`)
	G = CompileRegex(`(?<=G=)\w+\s\w+`)
	T = CompileRegex(`(?<=\sT=)[^,]+`)
	Date = regexp.MustCompile(`\d{2}/\d{2}/\d{4}\s{2}\d{2}:\d{2}:\d{2}\s\w{3}`)

	Splitter = regexp.MustCompile(`\s={77}\s`)
	SplitterSigns = regexp.MustCompile(`\s\d+-{7}`)

}
