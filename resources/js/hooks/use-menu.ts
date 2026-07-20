import { useMemo } from 'react';

import { accesoRapido as accesoRapidoData, menuGroups } from '@/config/menu';

import { usePermissions } from './use-permissions';

/**
 *  Hook to get the menu items that the user has access to, based on their permissions and roles.
 */
export function useMenu() {
    const { canAny, hasAnyRole } = usePermissions();

    const accesoRapido = useMemo(
        () =>
            accesoRapidoData.filter(
                (item) =>
                    (!item.can && !item.hasRole) ||
                    (item.can && !item.hasRole && canAny(item.can)) ||
                    (!item.can && item.hasRole && hasAnyRole(item.hasRole)) ||
                    (item.can &&
                        item.hasRole &&
                        canAny(item.can) &&
                        hasAnyRole(item.hasRole)),
            ),
        [canAny, hasAnyRole],
    );

    const menuAgrupado = useMemo(
        () =>
            menuGroups
                .map((group) => ({
                    ...group,
                    items: group.items.filter((item) => {
                        return (
                            (!item.can && !item.hasRole) ||
                            (item.can && !item.hasRole && canAny(item.can)) ||
                            (!item.can &&
                                item.hasRole &&
                                hasAnyRole(item.hasRole)) ||
                            (item.can &&
                                item.hasRole &&
                                canAny(item.can) &&
                                hasAnyRole(item.hasRole))
                        );
                    }),
                }))
                .filter((group) => group.items.length > 0),
        [canAny, hasAnyRole],
    );

    return {
        accesoRapido,
        menuAgrupado,
    };
}
