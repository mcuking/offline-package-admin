import React from 'react';
import { Form, Modal, Button } from 'antd';
import { FormComponentProps } from 'antd/es/form';
import { IPackageInfo } from '@/types';

const FormItem = Form.Item;

interface DetailModalProps extends FormComponentProps {
  current: IPackageInfo;
  detailModalVisible: boolean;
  setDetailModalVisible: (visible: boolean) => void;
}
const DetailModal: React.FC<DetailModalProps> = (props) => {
  const { current, detailModalVisible, setDetailModalVisible } = props;
  const patchUrls = current.patchUrls ? JSON.parse(current.patchUrls) : {};
  return (
    <Modal
      title="离线包信息"
      closable={false}
      visible={detailModalVisible}
      footer={[
        <Button
          key="ok"
          type="primary"
          onClick={() => setDetailModalVisible(false)}
        >
          关闭
        </Button>
      ]}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="模块名">
        {current.moduleName}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="版本号">
        {current.version}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="app名">
        {current.appName}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="状态">
        {current.status === 1 ? '在线' : '已停用'}
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="发布时间"
      >
        {current.createTime}
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="发布日志"
      >
        {current.updateLog}
      </FormItem>
      <FormItem
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 15 }}
        label="下载地址"
      >
        <div>
          <a href={current.fileUrl} target="_blank" rel="noopener noreferrer">
            全量包
          </a>
        </div>
        {Object.keys(patchUrls).map((version) => {
          return (
            <div key={version}>
              <a
                href={patchUrls[version].fileUrl}
                target="_blank"
                rel="noopener noreferrer"
              >{`${version} -> ${current.version}`}</a>
            </div>
          );
        })}
      </FormItem>
    </Modal>
  );
};

export default Form.create<DetailModalProps>()(DetailModal);
