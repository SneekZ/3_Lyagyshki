import React from 'react';
import { QRCode, Flex } from 'antd';
import headsetIcon from "./src/headset.png"
import { Link } from 'react-router-dom';

const NotFound = () => {

  return (
    <Flex className="notfound_container" vertical={true} gap="middle">
      <p>СТРАНИЦА НЕ НАЙДЕНА [404]</p>
      <p>вернуться на <Link to="/signs">главную</Link></p>
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