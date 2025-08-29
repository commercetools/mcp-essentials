import pluralize from 'pluralize';
import {Actions, Configuration} from '../types/configuration';

type Action = {[key: string]: Permission};
type Permission = {[actions: string]: boolean};

const adminScope = ['manage_project', 'manage_api_clients', 'view_api_clients'];

function normalize(str: string): string {
  return pluralize.plural(str).toLowerCase();
}

export function scopesToActions(
  scopes: Array<string>,
  configuration: Configuration
): Actions {
  const actions: Action = configuration.actions || {};
  if (scopes.some((scope) => adminScope.includes(scope))) {
    return Object.fromEntries(
      Object.entries(actions).map(([resource, {read, create, update}]) => {
        return [
          resource,
          {
            ...(read == undefined ? {} : {read}),
            ...(create == undefined ? {} : {create}),
            ...(update == undefined ? {} : {update}),
          },
        ];
      })
    );
  }

  return scopes.reduce((acc: Action, scope: string) => {
    // eslint-disable-next-line prefer-const
    let [type, ...resourceParts] = scope.split('_');

    // for scopes such as 'manage_my_orders' => ['manage', 'my', 'orders']
    if (resourceParts[0] == 'my') {
      type = type + '_' + resourceParts.shift(); // manage_my
    }

    const resource = resourceParts.join('-');
    const normalizedResource = normalize(resource);

    const permissions =
      // eslint-disable-next-line no-nested-ternary
      type == 'view'
        ? ['read']
        : ['manage', 'manage_my'].includes(type)
          ? ['read', 'create', 'update']
          : [];

    const resourceKey = Object.keys(actions).find((key) => {
      return normalizedResource.startsWith(normalize(key));
    });

    if (!resourceKey) return acc;

    acc[resourceKey] = acc[resourceKey] || {};
    permissions.forEach((permission) => {
      if (permission in actions[resourceKey]) {
        acc[resourceKey][permission] = actions[resourceKey][permission];
      }
    });

    return acc;
  }, {});
}
