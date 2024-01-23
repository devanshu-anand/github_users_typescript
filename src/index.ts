// inputs
const formSubmit = document.querySelector("#form") as HTMLFormElement;
const getUserName = document.querySelector("#user") as HTMLInputElement;
const mainContainer = document.querySelector(".main-container") as HTMLElement;

// Contract of User Data
interface UserData {
  id: number;
  login: string;
  avatar_url: string;
  location: string;
  url: string;
}

async function myCustomFetcher<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  let res = await fetch(url, options);
  if (!res.ok) {
    throw new Error(
      `Something went wrong in network with status ${res.status}`
    );
  }
  let data = await res.json();
  return data;
}

// Display User Cards
const showUserCard = (singleUser: UserData) => {
  const { avatar_url, login, url } = singleUser;
  mainContainer.insertAdjacentHTML(
    "beforeend",
    `<div class='card'> 
        <img src=${avatar_url} alt=${login} />
        <hr />
        <div class="card-footer">
        <img src="${avatar_url}" alt="${login}" /> 
        <a href="${url}" class="user-title">${login}</a>
        <a href="${url}"> Github </a>
        </div>
        </div>
        `
  );
};

// get All Users
function getAllUsers(url: string) {
  myCustomFetcher<UserData[]>(url, {}).then((userInfo) => {
    if (userInfo.length > 0) {
      for (const singleUser of userInfo) {
        showUserCard(singleUser);
      }
    }
  });
}

const baseURL: string = "https://api.github.com";
const allUsersURL: string = `${baseURL}/users`;
getAllUsers(allUsersURL);

// Handle Input Form
formSubmit.addEventListener("submit", async (e) => {
  e.preventDefault();
  let getSearchingUser = getUserName.value.toLowerCase();
  console.log(getSearchingUser);
  try {
    let userList = await myCustomFetcher<UserData[]>(allUsersURL, {});
    let matchingUsersList = userList.filter((user) => {
      return user.login.toLowerCase().includes(getSearchingUser);
    });
    mainContainer.innerHTML = "";

    if (matchingUsersList.length == 0) {
      mainContainer.insertAdjacentHTML(
        "beforeend",
        `<p class="empty-msg">No matching users found.</p>`
      );
    }else{
        for (const singleUser of matchingUsersList) {
            showUserCard(singleUser);
        }
    }
  } catch (e) {
    console.log("Error >>", e);
  }
});
