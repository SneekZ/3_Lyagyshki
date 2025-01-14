error_codes = {
    None: "Ошибка не была найдена",
    "0x8010006b": "Ошибка доступа, неверный пароль в бд [0x8010006b]",
    "0x2000012e": "Подпись дублирована [0x2000012e]",
    "0x80090010": "Просрочен закрытый ключ [0x80090010]",
    "0x2000012d": "Сертификат не найден [0x2000012d]",
    "0x0000065b": "Истекла лицензия КриптоПро [0x0000065b]"
}


def map_error(error_code: str) -> str:
    if error_code in error_codes:
        return error_codes[error_code]
    return error_code
