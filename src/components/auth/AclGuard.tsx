/* eslint-disable @typescript-eslint/no-unused-vars */
// ** React Imports
import { useRouter } from 'next/router'
import { ReactNode } from 'react'

// ** Types
import { buildAbilityFor, type ACLObj, type AppAbility } from 'src/configs/acl'
import { useAuth } from 'src/hooks/useAuth'
import { AbilityContext } from '../acl/Can'

interface AclGuardProps {
  children: ReactNode
  authGuard?: boolean
  guestGuard?: boolean
  aclAbilities: ACLObj
}

const AclGuard = (props: AclGuardProps) => {
  // ** Props
  const { aclAbilities, children, guestGuard = false, authGuard = true } = props

  const auth = useAuth();
  
  const permissionUser = auth.user?.role?.permissions ?? [];

  const router = useRouter();

  let ability: AppAbility;

  if (auth.user && !ability) {
    ability = buildAbilityFor(permissionUser, aclAbilities.subject)
  }

  // Các trang không cần phân quyền
  if (guestGuard || router.route === "/500" || router.route === "/404" || !authGuard) {
    if (auth.user && ability) {
      return <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>
    } else {
      return children
    }
  }

  // Check quyền
  if (ability && auth.user && ability.can(aclAbilities.action, aclAbilities.subject)) {
    return <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>
  } 
  
  return <>{children}</>
}

export default AclGuard
