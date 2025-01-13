package main

import (
	"bytes"
	"fmt"

	"golang.org/x/crypto/ssh"
)

type SshHandler struct {
	host     string
	port     string
	user     string
	password string

	config *ssh.ClientConfig
}

func NewSshHandler(host, port, user, password string) *SshHandler {
	config := &ssh.ClientConfig{
		User: user,
		Auth: []ssh.AuthMethod{
			ssh.Password(password),
		},
		HostKeyCallback: ssh.InsecureIgnoreHostKey(),
	}

	return &SshHandler{
		host:     host,
		port:     port,
		user:     user,
		password: password,
		config:   config,
	}
}

func (sh *SshHandler) Exec(command string) (string, error) {
	if command == "" {
		command = "/opt/cprocsp/bin/amd64/certmgr -list"
	}
	connection, err := ssh.Dial("tcp", fmt.Sprintf("%s:%s", sh.host, sh.port), sh.config)
	if err != nil {
		return "", fmt.Errorf("%w", err)
	}
	defer connection.Close()

	session, err := connection.NewSession()
	if err != nil {
		return "", fmt.Errorf("%w", err)
	}
	defer session.Close()

	var stdout, stderr bytes.Buffer
	session.Stdout = &stdout
	session.Stderr = &stderr

	if err := session.Run(command); err != nil {
		return "", fmt.Errorf("%w", err)
	}

	return stdout.String(), nil
}
