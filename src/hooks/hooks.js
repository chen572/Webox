import { createMuiTheme } from '@material-ui/core'
import { useEffect, useRef, useCallback, useState } from "react"
import { setCookie, parseCookie, deleteCookie } from '../utils/utils'

export const useTheme = darkState => {
  const palletType = darkState ? "dark" : "light"
  const mainPrimaryColor = darkState ? '#303030' : '#673ab7'
  const mainSecondaryColor = darkState ? '#9f66b7' : '#009688'

  return createMuiTheme({
    palette: {
      type: palletType,
      primary: {
        main: mainPrimaryColor
      },
      secondary: {
        main: mainSecondaryColor
      }
    },
    overrides: {
      MuiButton: {
        text: {
          background: mainPrimaryColor
        }
      },
      MuiCssBaseline: {
        '@global': {
          body: {
            backgroundColor: mainPrimaryColor
          }
        }
      }
    }
  })
}

export const useCreators = (store) => {
  const {
    searchInput, getTrending, setLoading, resetTrending, pageNum,
    category, loading, hasMore, getNextPage } = store

  const observer = useRef();
  const lastCreatorElementRef = useCallback((node) => {
    if (loading) { return }
    if (observer.current) { observer.current.disconnect() }
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        getNextPage()
      }
    })
    if (node) observer.current.observe(node)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, hasMore]);

  useEffect(() => {
    resetTrending()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category])

  useEffect(() => {
    setLoading(true)
    const cancel = getTrending(category, pageNum, searchInput)
    setLoading(false)
    return cancel
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, pageNum, searchInput])

  return lastCreatorElementRef
}

export const useCookie = () => {
  return { cookie: parseCookie(), setCookie, deleteCookie }
}

export const useIsAuth = (testFunc) => {
  const { cookie } = useCookie()

  useEffect(() => {
    if (cookie) {
      testFunc()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cookie])
}

export const useNewNotification = (notificationLength) => {
  const [notificationNum, setNotificationNum] = useState(notificationLength)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (notificationLength > notificationNum) setOpen(true)
    if (notificationLength !== notificationNum) {
      setNotificationNum(notificationLength)
    }
  }, [notificationLength, notificationNum])

  return { open, setOpen }
}