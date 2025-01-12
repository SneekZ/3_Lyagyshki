def password_generator():
    n = 11
    passwords = [""]
    for i in range(1, n):
        if not passwords:
            passwords.append(str(i))
        else:
            passwords.append(passwords[-1] + str(i)[-1])

    for password in passwords[:]:
        passwords.append(password[::-1])

    for password in passwords:
        yield password
