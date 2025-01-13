package main

import (
	"fmt"
	"os"
)

func main() {
	var host, port, user, password string

	if len(os.Args) == 5 {
		host = os.Args[1]
		port = os.Args[2]
		user = os.Args[3]
		password = os.Args[4]
	}

	sh := NewSshHandler(host, port, user, password)
	out, err := sh.Exec("")
	if err != nil {
		fmt.Fprintf(os.Stderr, err.Error())
		os.Exit(1)
	}

	parsed_signs, err := Parse(out)
	if err != nil {
		fmt.Fprintf(os.Stderr, err.Error())
		os.Exit(2)
	}

	fmt.Println(string(parsed_signs))
}
