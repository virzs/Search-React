/*
 * @Author: Vir
 * @Date: 2021-04-18 16:15:58
 * @Last Modified by: Vir
 * @Last Modified time: 2021-06-01 17:15:35
 */

import { getUuid, replaceUrlHaveHttpsOrHttpToEmpty } from '@/utils/common';
import { Effect, Reducer } from 'umi';

export interface SiteListType {
  id: string;
  name: string; //名称
  url: string; //网址
  count: number; //使用次数
}

export interface SitesStateType {
  list: SiteListType[];
}

export interface SitesModelType {
  namespace: string;
  state: SitesStateType;
  effects: {
    add: Effect;
    edit: Effect;
    addCount: Effect;
    del: Effect;
    repeal: Effect;
  };
  reducers: {
    add: Reducer<any>;
    edit: Reducer<any>;
    addCount: Reducer<any>;
    del: Reducer<any>;
    repeal: Reducer<any>;
  };
}

// 主页网站列表model
export default {
  namespace: 'sites',
  state: { list: [] },
  effects: {
    // 新增网址
    *add({ payload }, { put }) {
      return put({ type: 'add', payload });
    },
    // 编辑网址
    *edit({ payload }, { put }) {
      return put({ type: 'edit', payload });
    },
    // 网址计数
    *addCount({ payload }, { put }) {
      return put({ type: 'addCount', payload });
    },
    *del({ payload }, { put }) {
      return put({ type: 'del', payload });
    },
    *repeal({ payload }, { put }) {
      return put({ type: 'repeal', payload });
    },
  },
  reducers: {
    // 新增网址
    add(state, action) {
      const item = action.payload.item;
      const site = {
        ...item,
        id: getUuid(),
        count: 0,
        url: replaceUrlHaveHttpsOrHttpToEmpty(item.url),
      };
      return { ...state, list: state.list.concat(site) };
    },
    // 编辑网站
    edit(state, action) {
      const item = action.payload.item;
      return {
        ...state,
        list: state.list.map((i: SiteListType) =>
          i.id === item.id
            ? { ...item, url: replaceUrlHaveHttpsOrHttpToEmpty(item.url) }
            : i,
        ),
      };
    },
    // 网址计数
    addCount(state, action) {
      const id = action.payload.id;
      return {
        ...state,
        list: state.list.map((i: SiteListType) => {
          if (i.id === id) return { ...i, count: i.count + 1 };
          return i;
        }),
      };
    },
    // 删除网址
    del(state, action) {
      const id = action.payload.id;
      const item = state.list.find((i: SiteListType) => i.id === id);
      sessionStorage.setItem('repeal', JSON.stringify(item));
      return {
        ...state,
        list: state.list.filter((i: SiteListType) => i.id !== id),
      };
    },
    // 撤销
    repeal(state, action) {
      let item = {};
      let session = sessionStorage.getItem('repeal');
      if (session !== null) {
        item = JSON.parse(session);
        sessionStorage.removeItem('repeal');
      }
      if (Object.keys(item).length === 0) {
        return {
          ...state,
          list: state.list,
        };
      }
      return {
        ...state,
        list: state.list.concat(item),
      };
    },
  },
} as SitesModelType;
