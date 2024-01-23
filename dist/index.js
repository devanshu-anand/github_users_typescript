"use strict";
// inputs
const formSubmit = document.querySelector("#form");
const getUserName = document.querySelector("#user");
const mainContainer = document.querySelector(".main-container");
async function myCustomFetcher(url, options) {
    let res = await fetch(url, options);
    if (!res.ok) {
        throw new Error(`Something went wrong in network with status ${res.status}`);
    }
    let data = await res.json();
    return data;
}
// Display User Cards
const showUserCard = (singleUser) => {
    const { avatar_url, login, url } = singleUser;
    mainContainer.insertAdjacentHTML("beforeend", `<div class='card'> 
        <img src=${avatar_url} alt=${login} />
        <hr />
        <div class="card-footer">
        <img src="${avatar_url}" alt="${login}" /> 
        <a href="${url}" class="user-title">${login}</a>
        <a href="${url}"> Github </a>
        </div>
        </div>
        `);
};
// get All Users
function getAllUsers(url) {
    myCustomFetcher(url, {}).then((userInfo) => {
        if (userInfo.length > 0) {
            for (const singleUser of userInfo) {
                showUserCard(singleUser);
            }
        }
    });
}
const baseURL = "https://api.github.com";
const allUsersURL = `${baseURL}/users`;
getAllUsers(allUsersURL);
// Handle Input Form
formSubmit.addEventListener("submit", async (e) => {
    e.preventDefault();
    let getSearchingUser = getUserName.value.toLowerCase();
    console.log(getSearchingUser);
    try {
        let userList = await myCustomFetcher(allUsersURL, {});
        let matchingUsersList = userList.filter((user) => {
            return user.login.toLowerCase().includes(getSearchingUser);
        });
        mainContainer.innerHTML = "";
        if (matchingUsersList.length == 0) {
            mainContainer.insertAdjacentHTML("beforeend", `<p class="empty-msg">No matching users found.</p>`);
        }
        else {
            for (const singleUser of matchingUsersList) {
                showUserCard(singleUser);
            }
        }
    }
    catch (e) {
        console.log("Error >>", e);
    }
});
