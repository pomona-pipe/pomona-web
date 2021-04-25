import { Store } from 'vuex';
import { Route } from 'vue-router/types'

export default function(store: Store<any>) {
  const routerHistory: Partial<Route>[] = store.state.layout
    .routerHistory
  const currentRoute = routerHistory[routerHistory.length - 1]
  let visits = 0
  routerHistory.forEach((visited) => {
    if (currentRoute.fullPath === visited.fullPath) {
      visits++
    }
  })
  return visits
}
