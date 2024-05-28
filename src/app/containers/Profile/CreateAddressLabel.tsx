import React, { useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { translations } from 'sirius-next/packages/common/dist/locales/i18n';
import { Form, Modal, Input, message } from '@cfxjs/antd';
import { publishRequestError } from 'utils';
import { useGlobalData } from 'utils/hooks/useGlobal';
import SDK from 'js-conflux-sdk/dist/js-conflux-sdk.umd.min.js';
import { LOCALSTORAGE_KEYS_MAP } from 'utils/enum';

type Type = {
  a: string;
  l: string;
  t: number;
  u: number;
};

type Props = {
  visible: boolean;
  stage: string;
  data: {
    address: string;
    label?: string;
    note?: string;
  };
  list?: null | Array<Type>;
  labelLengthLimit?: number;
  onOk: () => void;
  onCancel: () => void;
};

export function CreateAddressLabel({
  visible = false,
  stage = 'create',
  data = {
    address: '',
    label: '',
  },
  list: outerList,
  labelLengthLimit = 20,
  onOk = () => {},
  onCancel = () => {},
}: Props) {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [list, setList] = useState<Type[]>(outerList || []);
  const [loading, setLoading] = useState(false);
  const [globalData, setGlobalData] = useGlobalData();

  useEffect(() => {
    try {
      if (!outerList) {
        setLoading(true);
        const l = localStorage.getItem(LOCALSTORAGE_KEYS_MAP.addressLabel);
        if (l) {
          setList(JSON.parse(l));
        }
        setLoading(false);
      } else {
        setList(outerList);
      }
    } catch (e) {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [outerList]);

  useEffect(() => {
    form.setFieldsValue(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const handleOk = () => {
    form.validateFields().then(async function ({ address, label }) {
      try {
        let newList: Array<Type> = list;
        const timestamp = Math.floor(+new Date() / 1000);

        if (stage === 'create') {
          for (let i = 0, len = list.length; i < len; i++) {
            const { a, l } = list[i];
            if (a === address) {
              message.error(t(translations.profile.address.error.duplicated));
              return;
            } else if (l === label) {
              message.error(
                t(translations.profile.address.error.duplicatedNameTag),
              );
              return;
            }
          }

          const item: Type = {
            a: address as string, // address
            l: label as string, // label
            t: timestamp, // create timestamp
            u: timestamp, // update timestamp
          };

          newList = [item].concat(list);
        } else if (stage === 'edit') {
          const i = list.findIndex(l => l.a === address);
          const old = list[i];

          newList.splice(i, 1);
          newList = [
            {
              ...old,
              u: timestamp,
              l: label as string,
            },
          ].concat(newList);
        }

        setLoading(true);

        localStorage.setItem(
          LOCALSTORAGE_KEYS_MAP.addressLabel,
          JSON.stringify(newList),
        );

        setGlobalData({
          ...globalData,
          [LOCALSTORAGE_KEYS_MAP.addressLabel]: newList.reduce((prev, curr) => {
            return {
              ...prev,
              [curr.a]: curr.l,
            };
          }, {}),
        });

        setLoading(false);
        onOk();
      } catch (e) {
        publishRequestError(e, 'code');
      }
    });
  };

  const handleCancel = () => {
    form.resetFields();
    setLoading(false);
    onCancel();
  };

  const validator = useCallback(() => {
    return {
      validator(_, value) {
        if (SDK.address.isValidHexAddress(value)) {
          return Promise.resolve();
        }
        return Promise.reject(
          new Error(t(translations.profile.address.error.invalidAddress)),
        );
      },
    };
  }, [t]);

  const tagValidator = useCallback(() => {
    return {
      validator(_, value) {
        if (value.length > labelLengthLimit) {
          return Promise.reject(
            new Error(
              t(translations.profile.address.error.invalidLabelRange, {
                amount: 20,
              }),
            ),
          );
        } else {
          return Promise.resolve();
        }
      },
    };
  }, [labelLengthLimit, t]);

  const text = {
    create: t(translations.general.create),
    edit: t(translations.general.edit),
    delete: t(translations.general.delete),
  };

  return (
    <Modal
      title={text[stage]}
      visible={visible}
      okText={t(translations.general.buttonOk)}
      cancelText={t(translations.general.buttonCancel)}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={loading}
    >
      <Form form={form} name="basic" labelCol={{ span: 5 }} autoComplete="off">
        <Form.Item
          label={t(translations.profile.address.address)}
          name="address"
          validateFirst={true}
          rules={[
            {
              required: true,
              message: t(translations.profile.address.error.address),
            },
            validator,
          ]}
        >
          <Input disabled={stage === 'edit'} />
        </Form.Item>
        <Form.Item
          label={t(translations.profile.address.label)}
          name="label"
          validateFirst={true}
          rules={[
            {
              required: true,
              message: t(translations.profile.address.error.label),
            },
            tagValidator,
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}
