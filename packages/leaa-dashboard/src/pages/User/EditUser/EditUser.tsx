import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, message } from 'antd';
import { useQuery, useMutation } from '@apollo/react-hooks';

import { User } from '@leaa/common/entrys';
import { GET_USER, GET_ROLES } from '@leaa/common/graphqls';
import { RolesObject, RolesArgs } from '@leaa/common/dtos/role';
import { UPDATE_BUTTON_ICON } from '@leaa/dashboard/constants';
import { UserArgs, UpdateUserInput } from '@leaa/common/dtos/user';
import { IPage } from '@leaa/dashboard/interfaces';
import { UPDATE_USER } from '@leaa/common/graphqls/user.mutation';
import { PageCard } from '@leaa/dashboard/components/PageCard';
import { ErrorCard } from '@leaa/dashboard/components/ErrorCard';
import { SubmitBar } from '@leaa/dashboard/components/SubmitBar/SubmitBar';

import { UserInfoForm } from '../_components/UserInfoForm/UserInfoForm';
import { UserRolesForm } from '../_components/UserRolesForm/UserRolesForm';

import style from './style.less';

export default (props: IPage) => {
  const { t } = useTranslation();
  const { id } = props.match.params as { id: string };

  let userInfoFormRef: any;
  let userRoleFormRef: any;

  const getUserVariables = { id: Number(id) };
  const getUserQuery = useQuery<{ user: User }, UserArgs>(GET_USER, {
    variables: getUserVariables,
  });

  const getRolesVariables = { pageSize: 9999 };
  const getRolesQuery = useQuery<{ roles: RolesObject }, RolesArgs>(GET_ROLES, {
    variables: getRolesVariables,
  });

  const [submitVariables, setSubmitVariables] = useState<{ id: number; user: UpdateUserInput }>({
    id: Number(id),
    user: {},
  });

  const [updateUserMutate, updateUserMutation] = useMutation<User>(UPDATE_USER, {
    variables: submitVariables,
    onCompleted: () => message.success(t('_lang:updatedSuccessfully')),
    refetchQueries: () => [{ query: GET_USER, variables: getUserVariables }],
  });

  const onSubmit = async () => {
    let hasError = false;
    let submitData: UpdateUserInput = { roleIds: [] };

    userRoleFormRef.props.form.validateFieldsAndScroll(async (err: any, formData: { roleIds: number[] }) => {
      if (err) {
        hasError = true;
        message.error(err[Object.keys(err)[0]].errors[0].message);
      }

      submitData.roleIds = formData.roleIds;
    });

    if (hasError) {
      return;
    }

    userInfoFormRef.props.form.validateFieldsAndScroll(async (err: any, formData: User) => {
      if (err) {
        hasError = true;
        message.error(err[Object.keys(err)[0]].errors[0].message);
      }

      submitData = {
        ...submitData,
        ...formData,
      };
    });

    if (hasError) {
      return;
    }

    const nextSubmitData = {
      ...submitVariables,
      ...{ user: submitData },
    };

    console.log(nextSubmitData);

    await setSubmitVariables(nextSubmitData);
    await updateUserMutate();
  };

  return (
    <PageCard title={t(`${props.route.namei18n}`)} className={style['page-wapper']} loading={false}>
      {getUserQuery.error ? <ErrorCard message={getUserQuery.error.message} /> : null}
      {getRolesQuery.error ? <ErrorCard message={getRolesQuery.error.message} /> : null}
      {updateUserMutation.error ? <ErrorCard message={updateUserMutation.error.message} /> : null}

      <UserInfoForm
        item={getUserQuery.data && getUserQuery.data.user}
        loading={getUserQuery.loading}
        wrappedComponentRef={(inst: unknown) => {
          userInfoFormRef = inst;
        }}
      />

      <UserRolesForm
        item={getUserQuery.data && getUserQuery.data.user}
        loading={getUserQuery.loading}
        roles={(getRolesQuery.data && getRolesQuery.data.roles && getRolesQuery.data.roles.items) || []}
        wrappedComponentRef={(inst: unknown) => {
          userRoleFormRef = inst;
        }}
      />

      <SubmitBar>
        <Button
          type="primary"
          size="large"
          icon={UPDATE_BUTTON_ICON}
          className="submit-button"
          loading={updateUserMutation.loading}
          onClick={onSubmit}
        >
          {t('_lang:update')}
        </Button>
      </SubmitBar>
    </PageCard>
  );
};
