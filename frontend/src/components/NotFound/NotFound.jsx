import React from 'react';
import { QRCode, Flex } from 'antd';
import headsetIcon from "./src/headset.png"

const NotFound = () => {

  return (
    <Flex className="notfound_container" vertical={true} gap="middle">
      <p>Страница не найдена [404 Error]</p>
      <QRCode
        size={420}
        errorLevel='H'
        value="https://youtu.be/YIBV4AnKKgU?si=y11hD3meD3Ic5qJQ"
        icon={ headsetIcon }
        color="white"/>
    </Flex>
  );
};

export default NotFound;