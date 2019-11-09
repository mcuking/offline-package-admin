import moment from 'moment';

const packageInfoTranslator = (packageInfo: any) => {
  packageInfo.statusStr = packageInfo.status === 1 ? '在线' : '已停用';
  packageInfo.createTime = moment(packageInfo.createTime).format(
    'YYYY-MM-DD HH:mm:ss'
  );
  packageInfo.key = packageInfo.id;
  return packageInfo;
};

export { packageInfoTranslator };
