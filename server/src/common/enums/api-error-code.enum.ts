export enum ApiErrorCode {
  TIMEOUT = 1, // 系统繁忙
  SUCCESS = 0, // 成功

  VERSION_INVALID = 10001, // 离线包版本无效
  FILE_TYPE_INVALID = 10002, // 上传文件类型无效
}
