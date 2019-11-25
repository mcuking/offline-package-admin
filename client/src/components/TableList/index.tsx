import React from 'react';
import {
  Table,
  Divider,
  Button,
  Modal,
  Form,
  Col,
  Row,
  Select,
  Input
} from 'antd';
import { FormComponentProps } from 'antd/es/form';
import CreateForm from './components/CreateForm';
import DetailModal from './components/DetailModal';
import { PackageService } from '@/services/package/requests';
import LocalConfig from '@/config.json';
import { IPackageInfo, IPackageInfoListQuery, IPagination } from '@/types';

import * as styles from './index.less';

const FormItem = Form.Item;
const Option = Select.Option;

interface TableListProps extends FormComponentProps {}

const TableList: React.FC<TableListProps> = (props) => {
  const columns = [
    {
      title: '模块名',
      dataIndex: 'moduleName',
      key: 'moduleName'
    },
    {
      title: '版本号',
      dataIndex: 'version',
      key: 'version'
    },
    {
      title: '状态',
      dataIndex: 'statusStr',
      key: 'statusStr'
    },
    {
      title: '发布时间',
      dataIndex: 'createTime',
      key: 'createTime'
    },
    {
      title: '操作',
      key: 'action',
      render: (text: string, record: IPackageInfo) => (
        <>
          <button
            className={styles.tableListButton}
            onClick={() => handleModalVisible(true, record)}
          >
            查看
          </button>
          {record.status === 1 && (
            <span>
              <Divider type="vertical" />
              <button
                className={styles.tableListButton}
                onClick={() => handleConfimStopPackage(record)}
              >
                终止发布
              </button>
            </span>
          )}
        </>
      )
    }
  ];

  const [packageList, setPackageList] = React.useState([] as IPackageInfo[]);

  const [listTotal, setListTotal] = React.useState(0);

  const [formValues, setFormValues] = React.useState({});

  const [createFormVisible, setCreateFormVisible] = React.useState(false);

  const [detailModalVisible, setDetailModalVisible] = React.useState(false);

  const [pushConfirmLoading, setPushConfirmLoading] = React.useState(false);

  const [current, setCurrent] = React.useState({} as IPackageInfo);

  const handleModalVisible = (visible: boolean, record: IPackageInfo) => {
    setDetailModalVisible(visible);
    setCurrent(record);
  };

  const handleAddPackage = async (data: FormData) => {
    try {
      await new PackageService().pushPackageInfo(data);
    } catch (error) {
      console.log(error);
    } finally {
      fetchPackageList({ page: 1, size: LocalConfig.ListQueryCount });
      setCreateFormVisible(false);
      setPushConfirmLoading(false);
    }
  };

  const handleStopPackage = async (data: IPackageInfo) => {
    try {
      await new PackageService().stopPackage(data.id);
    } catch (error) {
      console.log(error);
    } finally {
      fetchPackageList({ page: 1, size: LocalConfig.ListQueryCount });
    }
  };

  const handleConfimStopPackage = (data: IPackageInfo) => {
    Modal.confirm({
      title: '确认要终止发布该离线包吗？',
      okText: '确认',
      cancelText: '取消',
      onOk() {
        handleStopPackage(data);
      }
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();

    const { form } = props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      setFormValues(fieldsValue);
      fetchPackageList({
        page: 1,
        size: LocalConfig.ListQueryCount,
        ...fieldsValue
      });
    });
  };

  const handleFormReset = () => {
    const { form } = props;
    form.resetFields();
    setFormValues({});
    fetchPackageList({ page: 1, size: LocalConfig.ListQueryCount });
  };

  const handleTableChange = (pagination: IPagination) => {
    fetchPackageList({
      page: pagination.current!,
      size: pagination.pageSize!,
      ...formValues
    });
  };

  const fetchPackageList = async (query: IPackageInfoListQuery) => {
    if (query.moduleName === '') {
      Reflect.deleteProperty(query, 'moduleName');
    }

    if (query.status === 'all') {
      Reflect.deleteProperty(query, 'status');
    }

    const { list, total } = await new PackageService().getPackageInfoList(
      query
    );
    setPackageList(list);
    setListTotal(total);
  };

  React.useEffect(() => {
    fetchPackageList({ page: 1, size: LocalConfig.ListQueryCount });
  }, []);

  const renderForm = () => {
    const { form } = props;
    const { getFieldDecorator } = form;
    return (
      <Form onSubmit={handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="模块名">
              {getFieldDecorator('moduleName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="状态">
              {getFieldDecorator('status', {
                initialValue: 'all'
              })(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="all">全部状态</Option>
                  <Option value={1}>在线</Option>
                  <Option value={0}>已停用</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  };

  return (
    <>
      <div className={styles.tableList}>
        <div className={styles.tableListForm}>{renderForm()}</div>
        <div className={styles.tableListOperator}>
          <Button
            icon="plus"
            type="primary"
            onClick={() => setCreateFormVisible(true)}
          >
            新增离线包
          </Button>
        </div>
        <Table
          bordered
          pagination={{
            pageSize: LocalConfig.ListQueryCount,
            total: listTotal
          }}
          columns={columns}
          dataSource={packageList}
          onChange={handleTableChange}
        />
      </div>
      <CreateForm
        createFormVisible={createFormVisible}
        setCreateFormVisible={setCreateFormVisible}
        pushConfirmLoading={pushConfirmLoading}
        setPushConfirmLoading={setPushConfirmLoading}
        handleAddPackage={handleAddPackage}
      />
      <DetailModal
        current={current}
        detailModalVisible={detailModalVisible}
        setDetailModalVisible={setDetailModalVisible}
      />
    </>
  );
};

export default Form.create<TableListProps>()(TableList);
