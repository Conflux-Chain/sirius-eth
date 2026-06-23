import React, { useState, useEffect, useMemo } from 'react';
import { isAddress, isHash, isSafeNumberOrNumericStringInput } from 'utils';
import styled from 'styled-components';
import qs from 'query-string';
import lodash from 'lodash';
import { useHistory, useLocation } from 'react-router-dom';
import { Form, Row, Col, Input, Button, Select, DatePicker } from '@cfxjs/antd';
import { ColProps } from '@cfxjs/antd/es/col';
import {
  DebounceTokenSelect,
  TokenType,
  getTokenListByAddress,
} from './DebounceTokenSelect';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { translations } from 'locales/i18n';

type SearchFormItemsProps =
  | undefined
  | boolean
  | {
      col: ColProps;
      disabled?: boolean;
    };

export interface AdvancedSearchFormProps {
  blockHash?: SearchFormItemsProps;
  epoch?: SearchFormItemsProps;
  fromOrTo?: SearchFormItemsProps;
  from?: SearchFormItemsProps;
  to?: SearchFormItemsProps;
  token?: SearchFormItemsProps;
  tokenId?: SearchFormItemsProps;
  nonce?: SearchFormItemsProps;
  transactionHash?: SearchFormItemsProps;
  button?: SearchFormItemsProps;
  rangePicker?: SearchFormItemsProps;
  sender?: SearchFormItemsProps;
  bundler?: SearchFormItemsProps;
  entryPoint?: SearchFormItemsProps;
  author?: SearchFormItemsProps;
  delegatedAddress?: SearchFormItemsProps;
  txSender?: SearchFormItemsProps;
}

interface QueryProps {
  [index: string]: string;
}

const { Option } = Select;
const { RangePicker } = DatePicker;

export const transformDate = dates => {
  if (dates) {
    let start = dates[0]
      .format()
      .replace(/^(.*T)(.*)(\+.*)$/, '$100:00:00.000$3');
    let end = dates[1]
      .format()
      .replace(/^(.*T)(.*)(\+.*)$/, '$123:59:59.999$3');
    return [moment(start), moment(end)];
  }
};

const defaultProps = {
  transactionHash: {
    col: {
      xs: 24,
      sm: 6,
      md: 6,
      lg: 6,
      xl: 6,
    },
  },
  blockHash: {
    col: {
      xs: 24,
      sm: 8,
      md: 8,
      lg: 8,
      xl: 8,
    },
  },
  fromOrTo: {
    col: {
      xs: 24,
      sm: 12,
      md: 12,
      lg: 12,
      xl: 12,
    },
  },
  rangePicker: {
    col: {
      xs: 24,
      sm: 6,
      md: 6,
      lg: 6,
      xl: 6,
    },
  },
  tokenId: {
    col: {
      xs: 24,
      sm: 4,
      md: 4,
      lg: 4,
      xl: 4,
    },
  },
  nonce: {
    col: {
      xs: 24,
      sm: 4,
      md: 4,
      lg: 4,
      xl: 4,
    },
  },
  epoch: {
    col: {
      xs: 12,
      sm: 3,
      md: 3,
      lg: 3,
      xl: 3,
    },
  },
  token: {
    col: {
      xs: 24,
      sm: 8,
      md: 8,
      lg: 8,
      xl: 8,
    },
  },
  sender: {
    col: {
      xs: 24,
      sm: 6,
      md: 6,
      lg: 6,
      xl: 6,
    },
  },
  bundler: {
    col: {
      xs: 24,
      sm: 6,
      md: 6,
      lg: 6,
      xl: 6,
    },
  },
  entryPoint: {
    col: {
      xs: 24,
      sm: 6,
      md: 6,
      lg: 6,
      xl: 6,
    },
  },
  author: {
    col: {
      xs: 24,
      sm: 6,
      md: 6,
      lg: 6,
      xl: 6,
    },
  },
  delegatedAddress: {
    col: {
      xs: 24,
      sm: 6,
      md: 6,
      lg: 6,
      xl: 6,
    },
  },
  txSender: {
    col: {
      xs: 24,
      sm: 6,
      md: 6,
      lg: 6,
      xl: 6,
    },
  },
  button: {
    col: {
      xs: 24,
      sm: 24,
      md: 24,
      lg: 6,
      xl: 6,
    },
  },
};

const normalizeNumericString = (value, prevValue) => {
  return value === '' || isSafeNumberOrNumericStringInput(value)
    ? value
    : prevValue;
};

const getMinAndMaxEpochNumber = (min, max) => {
  let minEpoch = min;
  let maxEpoch = max;

  try {
    if (!lodash.isNil(min) && !lodash.isNil(max)) {
      if (Number(min) > Number(max)) {
        minEpoch = max;
        maxEpoch = min;
      }
    }
  } catch (e) {}

  return [minEpoch, maxEpoch];
};

// @todo, props should be changed to Array like, easy to sort filter items
export const AdvancedSearchForm = (props: AdvancedSearchFormProps) => {
  const { t, i18n } = useTranslation();
  const { pathname, search } = useLocation();
  const query = qs.parse(search);
  const history = useHistory();
  const [form] = Form.useForm();
  const [fromOrToValue, setFromOrToValue] = useState('from');
  const [tokenValue, setTokenValue] = useState<TokenType[]>([]);
  const fromOrToOptions = useMemo(() => {
    return [
      {
        key: 'from',
        label: t(translations.general.advancedSearch.label.from),
      },
      {
        key: 'to',
        label: t(translations.general.advancedSearch.label.to),
      },
      {
        key: 'fromOrTo',
        label: t(translations.general.advancedSearch.label.fromOrTo),
      },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const {
    blockHash,
    epoch,
    fromOrTo,
    token,
    tokenId,
    nonce,
    transactionHash,
    rangePicker,
    sender,
    bundler,
    entryPoint,
    author,
    delegatedAddress,
    txSender,
  } = props;

  const validators = useMemo(() => {
    return {
      isHash: (_, value) => {
        if (!value || isHash(value)) {
          return Promise.resolve();
        }
        return Promise.reject(
          new Error(t(translations.general.advancedSearch.error.invalidHash)),
        );
      },
      isAddress: (_, value) => {
        if (!value || isAddress(value, false)) {
          return Promise.resolve();
        }
        return Promise.reject(
          new Error(
            t(translations.general.advancedSearch.error.invalidAddress),
          ),
        );
      },
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  useEffect(() => {
    let fromOrToValue = 'from';
    const {
      from,
      to,
      tokenArray,
      minTimestamp,
      maxTimestamp,
      minEpochNumber,
      maxEpochNumber,
    } = query;

    if (from && to) {
      fromOrToValue = 'fromOrTo';
    } else if (to) {
      fromOrToValue = 'to';
    } else if (from) {
      fromOrToValue = 'from';
    }

    setFromOrToValue(fromOrToValue);

    try {
      const minT = parseInt(minTimestamp + '000');
      const maxT = parseInt(maxTimestamp + '000') - 1;

      const [minEpoch, maxEpoch] = getMinAndMaxEpochNumber(
        minEpochNumber,
        maxEpochNumber,
      );

      const value = {
        ...Object.keys(props)
          .map(k => ({
            [k]: query[k] || '',
          }))
          .reduce((prev, next) => ({ ...prev, ...next }), {}),
        // special handle with fromOrTo value
        fromOrTo: from || to,
        // special handle with token value
        token: tokenValue
          .filter(t => tokenArray?.includes(t.address))
          .map(t => t.address),
        // special handle with range picker value
        rangePicker: [minT ? moment(minT) : null, maxT ? moment(maxT) : null],
        minEpochNumber: minEpoch,
        maxEpochNumber: maxEpoch,
        // special handle with delegatedAddress value
        address: query.address || '',
      };

      form.setFieldsValue(value);
    } catch (e) {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  useEffect(() => {
    // update token field when init component on first time
    const { tokenArray = [] } = query;
    if (!tokenValue.length || tokenArray?.length) {
      getTokenListByAddress(tokenArray as Array<string>).then(resp => {
        form.setFieldsValue({
          token: resp
            .filter(t => tokenArray?.includes(t.address))
            .map(t => t.address),
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleFromOrToChange = value => {
    setFromOrToValue(value);
  };

  const handleFinish = (values: any) => {
    const {
      transactionHash,
      blockHash,
      tokenId,
      nonce,
      minEpochNumber,
      maxEpochNumber,
      tokenArray,
      from,
      to,
      minTimestamp,
      maxTimestamp,
      sender,
      bundler,
      entryPoint,
      author,
      delegatedAddress,
      txSender,
      ...others
    } = qs.parse(search);

    const query: QueryProps = {
      ...(others as QueryProps),
      skip: '0',
    };

    if (props.transactionHash && values.transactionHash) {
      query.transactionHash = values.transactionHash;
    }

    if (props.blockHash && values.blockHash) {
      query.blockHash = values.blockHash;
    }

    if (props.fromOrTo && values.fromOrTo) {
      if (fromOrToValue === 'from') {
        query.from = values.fromOrTo;
      } else if (fromOrToValue === 'to') {
        query.to = values.fromOrTo;
      } else {
        query.from = values.fromOrTo;
        query.to = values.fromOrTo;
      }
    }

    if (props.tokenId && values.tokenId) {
      query.tokenId = values.tokenId;
    }

    if (props.nonce && values.nonce) {
      query.nonce = values.nonce;
    }

    if (props.epoch && values.minEpochNumber) {
      query.minEpochNumber = values.minEpochNumber;
    }

    if (props.epoch && values.maxEpochNumber) {
      query.maxEpochNumber = values.maxEpochNumber;
    }

    if (
      !lodash.isNil(query.minEpochNumber) &&
      !lodash.isNil(query.maxEpochNumber)
    ) {
      if (Number(query.minEpochNumber) > Number(query.maxEpochNumber)) {
        [query.minEpochNumber, query.maxEpochNumber] = [
          query.maxEpochNumber,
          query.minEpochNumber,
        ];
      }
    }

    if (props.token && values.token) {
      query.tokenArray = values.token;
    }

    if (
      props.rangePicker &&
      values.rangePicker &&
      values.rangePicker.every(d => !!d)
    ) {
      const dates = transformDate(values.rangePicker)?.map((r, index) => {
        if (!index) {
          return String(Math.floor(moment(r).valueOf() / 1000));
        } else {
          return String(Math.round(moment(r).valueOf() / 1000));
        }
      });

      if (dates) {
        query.minTimestamp = dates[0];
        query.maxTimestamp = dates[1];
      }
    }

    if (props.sender && values.sender) {
      query.sender = values.sender;
    }
    if (props.bundler && values.bundler) {
      query.bundler = values.bundler;
    }
    if (props.entryPoint && values.entryPoint) {
      query.entryPoint = values.entryPoint;
    }

    if (props.author && values.author) {
      query.author = values.author;
    }
    if (props.delegatedAddress && values.address) {
      query.address = values.address;
    }
    if (props.txSender && values.txSender) {
      query.txSender = values.txSender;
    }

    const urlWithQuery = qs.stringifyUrl({
      url: pathname,
      query,
    });

    history.push(urlWithQuery);
  };

  const handleReset = () => {
    const query = lodash.omit(
      qs.parse(search),
      Object.keys(props).concat(
        'from',
        'to',
        'maxTimestamp',
        'minTimestamp',
        'maxEpochNumber',
        'minEpochNumber',
        'tokenArray',
        'address',
      ),
    );

    const urlWithQuery = qs.stringifyUrl({
      url: pathname,
      query,
    });

    form.resetFields();

    history.push(urlWithQuery);
  };

  const getFields = useMemo(() => {
    const children: Array<React.ReactElement> = [];

    if (transactionHash) {
      const col =
        typeof props.transactionHash !== 'boolean'
          ? props.transactionHash?.col
          : defaultProps.transactionHash.col;

      children.push(
        <Col {...col} key="transactionHash">
          <Form.Item
            name={`transactionHash`}
            label={t(translations.general.advancedSearch.label.txnHash)}
            normalize={value => value.trim()}
            rules={[{ validator: validators.isHash }]}
            key={Math.random()}
          >
            <Input
              placeholder={t(
                translations.general.advancedSearch.placeholder
                  .pleaseEnterTxnHash,
              )}
              allowClear
            />
          </Form.Item>
        </Col>,
      );
    }

    if (blockHash) {
      const col =
        typeof props.blockHash !== 'boolean'
          ? props.blockHash?.col
          : defaultProps.blockHash.col;

      children.push(
        <Col {...col} key="blockHash">
          <Form.Item
            name={`blockHash`}
            label={t(translations.general.advancedSearch.label.blockHash)}
            normalize={value => value.trim()}
            rules={[{ validator: validators.isHash }]}
          >
            <Input
              placeholder={t(
                translations.general.advancedSearch.placeholder
                  .pleaseEnterBlockHash,
              )}
              allowClear
            />
          </Form.Item>
        </Col>,
      );
    }

    if (fromOrTo) {
      const colFromOrTo =
        typeof props.fromOrTo !== 'boolean'
          ? props.fromOrTo?.col
          : defaultProps.fromOrTo.col;

      children.push(
        <Col {...colFromOrTo} key="fromOrTo">
          <Form.Item
            name={`fromOrTo`}
            label={t(translations.general.advancedSearch.label.address)}
            normalize={value => value.trim()}
            rules={[{ validator: validators.isAddress }]}
          >
            <Input
              style={{ width: '100%' }}
              addonBefore={
                <Select
                  value={fromOrToValue}
                  style={{
                    width: '8.5714rem',
                  }}
                  onChange={handleFromOrToChange}
                  disabled={
                    typeof props.fromOrTo === 'object' &&
                    props.fromOrTo?.disabled
                  }
                >
                  {fromOrToOptions.map(o => {
                    return (
                      <Option value={o.key} key={o.key}>
                        {o.label}
                      </Option>
                    );
                  })}
                </Select>
              }
              placeholder=""
              allowClear
            />
          </Form.Item>
        </Col>,
      );
    }

    if (epoch) {
      const colEpoch =
        typeof props.epoch !== 'boolean'
          ? props.epoch?.col
          : defaultProps.epoch.col;

      children.push(
        <Col {...colEpoch} key="minEpochNumber">
          <Form.Item
            name={`minEpochNumber`}
            label={t(translations.general.advancedSearch.label.epochNumber)}
            normalize={normalizeNumericString}
            // rules={[
            //   ({ getFieldValue }) => ({
            //     validator(_, value) {
            //       if (!value) {
            //         return Promise.resolve();
            //       } else {
            //         const maxEpochNumber = getFieldValue('maxEpochNumber');

            //         if (maxEpochNumber) {
            //           if (Number(maxEpochNumber) >= Number(value)) {
            //             return Promise.resolve();
            //           } else {
            //             return Promise.reject(
            //               new Error(
            //                 'maxEpochNumber should greater than minEpochNumber',
            //               ),
            //             );
            //           }
            //         } else {
            //           return Promise.resolve();
            //         }
            //       }
            //     },
            //   }),
            // ]}
          >
            <Input
              placeholder={t(
                translations.general.advancedSearch.placeholder
                  .pleaseEnterEpochStart,
              )}
              allowClear
            />
          </Form.Item>
        </Col>,
        <Col {...colEpoch} key="maxEpochNumber">
          <Form.Item
            name={`maxEpochNumber`}
            label={' '}
            normalize={normalizeNumericString}
            className="advanced-from-maxEpochNumber"
            // rules={[
            //   ({ getFieldValue }) => ({
            //     validator(_, value) {
            //       if (!value) {
            //         return Promise.resolve();
            //       } else {
            //         const minEpochNumber = getFieldValue('minEpochNumber');

            //         if (minEpochNumber) {
            //           if (Number(minEpochNumber) <= Number(value)) {
            //             return Promise.resolve();
            //           } else {
            //             return Promise.reject(
            //               new Error(
            //                 'minEpochNumber should greater than maxEpochNumber',
            //               ),
            //             );
            //           }
            //         } else {
            //           return Promise.resolve();
            //         }
            //       }
            //     },
            //   }),
            // ]}
          >
            <Input
              placeholder={t(
                translations.general.advancedSearch.placeholder
                  .pleaseEnterEpochEnd,
              )}
              allowClear
            />
          </Form.Item>
        </Col>,
      );
    }

    if (rangePicker) {
      const col =
        typeof props.rangePicker !== 'boolean'
          ? props.rangePicker?.col
          : defaultProps.rangePicker.col;

      children.push(
        <Col {...col} key="rangerPicker">
          <Form.Item
            name="rangePicker"
            label={t(translations.general.advancedSearch.label.rangePicker)}
          >
            <RangePicker
              style={{ width: '100%' }}
              disabledDate={current => {
                return (
                  current.valueOf() > moment().valueOf() ||
                  // mainnet release
                  current.valueOf() <
                    moment('2020-10-29T00:00:00+08:00').valueOf()
                );
              }}
            />
          </Form.Item>
        </Col>,
      );
    }

    if (token) {
      const col =
        typeof props.token !== 'boolean'
          ? props.token?.col
          : defaultProps.token.col;

      children.push(
        <Col {...col} key="token">
          <Form.Item
            name={`token`}
            label={
              <>
                {t(translations.general.advancedSearch.label.token)}
                <div className="advanced-from-token-subtitle">
                  {t(translations.general.advancedSearch.label.tokenSubTitle)}
                </div>
              </>
            }
          >
            <DebounceTokenSelect
              mode="multiple"
              placeholder={t(
                translations.general.advancedSearch.placeholder.pleaseSelect,
              )}
              onChange={newValue => {
                setTokenValue(newValue);
              }}
              style={{ width: '100%' }}
              maxTagCount="responsive"
            />
          </Form.Item>
        </Col>,
      );
    }

    if (tokenId) {
      const col =
        typeof props.tokenId !== 'boolean'
          ? props.tokenId?.col
          : defaultProps.tokenId.col;

      children.push(
        <Col {...col} key="tokenId">
          <Form.Item
            name={`tokenId`}
            label={t(translations.general.advancedSearch.label.tokenId)}
            normalize={normalizeNumericString}
          >
            <Input
              placeholder={t(
                translations.general.advancedSearch.placeholder
                  .pleaseEnterTokenId,
              )}
              allowClear
            />
          </Form.Item>
        </Col>,
      );
    }

    if (nonce) {
      const col =
        typeof props.nonce !== 'boolean'
          ? props.nonce?.col
          : defaultProps.nonce.col;

      children.push(
        <Col {...col} key="nonce">
          <Form.Item
            name={`nonce`}
            label={t(translations.general.advancedSearch.label.nonce)}
            normalize={normalizeNumericString}
          >
            <Input
              placeholder={t(
                translations.general.advancedSearch.placeholder
                  .pleaseEnterNonce,
              )}
              type="number"
              min="0"
              allowClear
            />
          </Form.Item>
        </Col>,
      );
    }

    if (sender) {
      const col =
        typeof sender !== 'boolean' ? sender?.col : defaultProps.sender.col;

      children.push(
        <Col {...col} key="sender">
          <Form.Item
            name="sender"
            label={t(translations.general.advancedSearch.label.sender)}
            normalize={value => value.trim()}
            rules={[{ validator: validators.isAddress }]}
          >
            <Input placeholder="" allowClear />
          </Form.Item>
        </Col>,
      );
    }
    if (bundler) {
      const col =
        typeof bundler !== 'boolean' ? bundler?.col : defaultProps.bundler.col;

      children.push(
        <Col {...col} key="bundler">
          <Form.Item
            name="bundler"
            label={t(translations.general.advancedSearch.label.bundler)}
            normalize={value => value.trim()}
            rules={[{ validator: validators.isAddress }]}
          >
            <Input placeholder="" allowClear />
          </Form.Item>
        </Col>,
      );
    }
    if (entryPoint) {
      const col =
        typeof entryPoint !== 'boolean'
          ? entryPoint?.col
          : defaultProps.entryPoint.col;

      children.push(
        <Col {...col} key="entryPoint">
          <Form.Item
            name="entryPoint"
            label={t(translations.general.advancedSearch.label.entryPoint)}
            normalize={value => value.trim()}
            rules={[{ validator: validators.isAddress }]}
          >
            <Input placeholder="" allowClear />
          </Form.Item>
        </Col>,
      );
    }
    if (author) {
      const col =
        typeof author !== 'boolean' ? author?.col : defaultProps.author.col;

      children.push(
        <Col {...col} key="author">
          <Form.Item
            name="author"
            label={t(translations.general.advancedSearch.label.author)}
            normalize={value => value.trim()}
            rules={[{ validator: validators.isAddress }]}
          >
            <Input placeholder="" allowClear />
          </Form.Item>
        </Col>,
      );
    }
    if (delegatedAddress) {
      const col =
        typeof delegatedAddress !== 'boolean'
          ? delegatedAddress?.col
          : defaultProps.delegatedAddress.col;

      children.push(
        <Col {...col} key="address">
          <Form.Item
            name="address"
            label={t(
              translations.general.advancedSearch.label.delegatedAddress,
            )}
            normalize={value => value.trim()}
            rules={[{ validator: validators.isAddress }]}
          >
            <Input placeholder="" allowClear />
          </Form.Item>
        </Col>,
      );
    }
    if (txSender) {
      const col =
        typeof txSender !== 'boolean'
          ? txSender?.col
          : defaultProps.txSender.col;

      children.push(
        <Col {...col} key="txSender">
          <Form.Item
            name="txSender"
            label={t(translations.general.advancedSearch.label.txSender)}
            normalize={value => value.trim()}
            rules={[{ validator: validators.isAddress }]}
          >
            <Input placeholder="" allowClear />
          </Form.Item>
        </Col>,
      );
    }

    const colButton =
      typeof props.button !== 'boolean'
        ? props.button?.col
        : defaultProps.button.col;

    children.push(
      <Col
        style={{
          textAlign: 'right',
        }}
        {...colButton}
        key="buttonGroup"
      >
        <Form.Item label={` `}>
          <StyledButtonWrapper>
            <Button
              className="advanced-search-button"
              type="primary"
              htmlType="submit"
            >
              {t(translations.general.advancedSearch.button.lookup)}
            </Button>
          </StyledButtonWrapper>
          <StyledButtonWrapper>
            <Button
              className="advanced-search-button"
              style={{ marginLeft: '8px' }}
              onClick={handleReset}
            >
              {t(translations.general.advancedSearch.button.reset)}
            </Button>
          </StyledButtonWrapper>
        </Form.Item>
      </Col>,
    );

    return children;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromOrToValue]);

  return (
    <StyledAdvancedFormWrapper>
      <Form
        form={form}
        name="advanced_search"
        className="ant-advanced-search-form"
        onFinish={handleFinish}
        layout="vertical"
      >
        <Row gutter={24}>{getFields}</Row>
      </Form>
    </StyledAdvancedFormWrapper>
  );
};

const StyledAdvancedFormWrapper = styled.div`
  .advanced-from-maxEpochNumber {
    .ant-form-item-control {
      position: relative;

      &:before {
        content: '-';
        position: absolute;
        top: 4px;
        left: -15px;
      }
    }
  }

  .advanced-from-token-subtitle {
    font-size: 12px;
    margin-left: 4px;
    opacity: 0.75;
  }
`;

const StyledButtonWrapper = styled.span`
  .advanced-search-button {
    width: 8.5rem;
  }
`;
