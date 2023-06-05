const getTargetTab = (openTabs, direction) => {
  let targetTab
  direction == "prev" ?  
    targetTab = openTabs.find(tab => tab.index === currentTab.index - 1) : 
    targetTab = openTabs.find(tab => tab.index === currentTab.index + 1)
    
  console.table(targetTab)

  return targetTab
    
}


chrome.commands.onCommand.addListener((command, currTab) => {
  const DIRECTION = {
    "next_tab": "next",
    "prev_tab": "prev"
  }
  const direction = DIRECTION[command] // determine which direction on the tab stack to traverse
  chrome.tabs.query({windowId:currTab.windowId}).then((tabs) => {
    if (command === "duplicate_tab") { // did we ask for a tab to be duplicated?
      chrome.tabs.duplicate(currTab.id, (t) => {})
      return // break out of the callback function from the tab query
    }
    let targetIndex = direction === "prev" ? currTab.index - 1  : currTab.index + 1 // based on direction, go up or down the tab stack
    if (targetIndex === tabs.length && direction === "next") // if we are at the end of the tab stack, go to the beginning if we asked for the next tab
      targetIndex = 0
    if (currTab.index === 0 && direction === "prev") // if we are at the beginning, go to the end if we asekd for the prev tab
      targetIndex = tabs.length - 1
    console.warn(targetIndex)
    let targetTab = tabs.find(t=>t.index === targetIndex)
    console.table(targetTab)
    updateProperties = {
      active: true,
      highlighted: true
    }
    chrome.tabs.update(targetTab.id,updateProperties,null)
  }) 
})
