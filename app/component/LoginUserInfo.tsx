const LoginUserInfo: React.FC<{ loginId: string }> = ({ loginId: loginId }) => {
  return <div className="text-right">Login ID: {loginId}</div>;
};

export default LoginUserInfo;