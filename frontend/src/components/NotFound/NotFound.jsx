import React from 'react';
import { QRCode } from 'antd';
import headsetIcon from "./src/headset.png"

const NotFound = () => {

  return (
    <div className="notfound_container">
      <QRCode
        size={420}
        errorLevel='H'
        value="https://youtu.be/YIBV4AnKKgU?si=y11hD3meD3Ic5qJQ"
        icon={ headsetIcon }
        color="white"/>
    </div>
  );
};

export default NotFound;