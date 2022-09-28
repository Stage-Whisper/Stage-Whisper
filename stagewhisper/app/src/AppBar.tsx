import { Button, Tabs } from '@mantine/core';
import React, { useState } from 'react';

// import Icon from './assets/icons/Icon-Electron.png';

function AppBar() {
  const [isMaximize, setMaximize] = useState(false);

  const handleToggle = () => {
    if (isMaximize) {
      setMaximize(false);
    } else {
      setMaximize(true);
    }
    window.Main.Maximize();
  };

  return (
    <Tabs>
      <Tabs.List>
        <Tabs.Tab value="home">home</Tabs.Tab>
        <Tabs.Tab value="away">away</Tabs.Tab>
        <Button onClick={handleToggle} variant="outline" color="red" />
      </Tabs.List>
    </Tabs>
  );
}

export default AppBar;
