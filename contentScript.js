
// ------------------------- message listener -------------------------
chrome.runtime.onMessage.addListener(async (object, sender, response) => {

  if(object.id === "BLOCK_PAGE"){
    showBlockMessage();
  }

  return true;
});

function showBlockMessage(){
  let body = document.getElementsByTagName("body");
  let randomEmotes = ['❄️','🦄','🦖','😁','👆','🌍','🌎','🌈','☔','🦕','🐬','🐋','🐳','🦞',
  '👽','☺️','🚴‍♂️','🚵‍♀️','🚵','🤸‍♂️','💡','🎥','📸','🍢','🥧','🍰','🚞','✈️','🛩️','❎'];

  body[0].innerHTML = "";
  body[0].style.overflow = "hidden";

  let blockMesage = `
  <div 
    style="
      width: 100vw; 
      height: 100vh; 
      display: flex; 
      flex-direction: column;
      justify-content: center; 
      align-items: center; 
      gap: 20px;
      text-align: center;
      font-size: 100px; 
      overflow: hidden;
      color: #f1f1f1">
    ${randomEmotes[Math.floor(Math.random() * randomEmotes.length)]}
    <h1 style="font-size: 28px">Page is blocked Youtube Blocker Extension.</h1>
    <p style="font-size: 16px">Please turn off youtube blocker extension to access this page. <br/>
      Click on green circle to turn on/off the blocker.☝️</p>
  </div>
  `;
  body[0].innerHTML = blockMesage;
}
