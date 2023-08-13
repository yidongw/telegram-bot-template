export function setupCounter(element: HTMLButtonElement) {
  let counter = 0

  const getCounterLabel = (count: number) => `Count is ${count}`
  const setCounter = (count: number) => {
    counter = count
    count > 0 && Telegram.WebApp.HapticFeedback.notificationOccurred("success")
    element.innerHTML = getCounterLabel(count)
    Telegram.WebApp.MainButton.text = getCounterLabel(count)
  }

  Telegram.WebApp.MainButton
    .setParams({
      is_active: true,
      is_visible: true,
      text: getCounterLabel(counter)
    })
    .onClick(() => setCounter(counter + 1))
    
  element.addEventListener('click', () => setCounter(counter + 1))

  setCounter(0)
}
