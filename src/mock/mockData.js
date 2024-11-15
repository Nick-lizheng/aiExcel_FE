import Mock from 'mockjs';

// 模拟数据：用户名和密码
Mock.mock('/api/login', 'post', (options) => {
  const { username, password } = JSON.parse(options.body);

  // 模拟的正确账号密码
  const mockUsername = 'admin';
  const mockPassword = 'password123';

  if (username === mockUsername && password === mockPassword) {
    return {
      status: 200,
      message: 'Login successful!',
      token: 'mock-token-123456', // 模拟一个 token
    };
  } else {
    return {
      status: 400,
      message: 'Invalid username or password.',
    };
  }
});
