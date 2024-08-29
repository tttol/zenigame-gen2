import React from "react";

const AppVersion: React.FC = () => {
  const getAppVersion = () => {
    const packageJson = require("../../package.json");
    return packageJson.version;
  };
  return (
    <div>
      <p className="text-right">version: {getAppVersion()}</p>
    </div>
  );
};

export default AppVersion;
