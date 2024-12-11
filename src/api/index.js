async function fetchEmails() {
    const response = await fetch('https://jsonplaceholder.typicode.com/comments');
    const userList = await response.json();
    return userList;
}

export default fetchEmails;

