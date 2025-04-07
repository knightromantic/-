export const handleApiError = (error) => {
  if (error.response) {
    // 服务器响应错误
    switch (error.response.status) {
      case 401:
        return '请先登录';
      case 403:
        return '没有权限执行此操作';
      case 404:
        return '请求的资源不存在';
      case 422:
        return error.response.data.message || '提交的数据无效';
      case 500:
        return '服务器错误，请稍后重试';
      default:
        return error.response.data.message || '操作失败，请重试';
    }
  } else if (error.request) {
    // 请求发送失败
    return '网络连接失败，请检查网络设置';
  } else {
    // 其他错误
    return '发生错误，请重试';
  }
};