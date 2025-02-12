import base64
import zlib


def decrypt_password(encrypted_password):
    if encrypted_password is None or encrypted_password == "":
        return ""
    decoded_data = zlib.decompress(base64.b64decode(encrypted_password[4:]))
    decoded_text = decoded_data.decode('utf-8')
    result = decoded_text.split('\n', 1)[-1]
    return result


def encrypt_password(password):
    # Добавляем разделитель, чтобы соответствовать шифровке
    data_to_compress = '\n' + password
    # Сжимаем данные
    compressed_data = zlib.compress(data_to_compress.encode('utf-8'))
    # Кодируем в base64
    encoded_data = base64.b64encode(compressed_data).decode('utf-8')
    # Добавляем префикс (первые 4 символа могут быть любыми, например "enc_")
    encrypted_password = "#1##" + encoded_data
    return encrypted_password


if __name__ == "__main__":
    # print(repr(decrypt_password("#1##eNrTDmXjAgABxQCR")))
    # print(repr(decrypt_password("#1##eNqL8TPnCvYzMjMwNDfKBgAWRwMq")))
    # print(repr(decrypt_password("#1##eNoLMDLkMjQyBgAFqgFU")))
    print(encrypt_password("123456"))
