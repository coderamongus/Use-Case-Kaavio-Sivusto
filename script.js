let votes = [];
let votedPolls = [];

function displayVotes() {
    const votesList = document.getElementById('votes-list');
    votesList.innerHTML = '';
    votes.forEach(vote => {
        const li = document.createElement('li');
        li.textContent = vote.title;
        if (isAdmin) {
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.addEventListener('click', () => deleteVote(vote.id));
            li.appendChild(deleteButton);
        }
        li.addEventListener('click', () => showVoteDetails(vote));
        votesList.appendChild(li);
    });
}

function createVote() {
    if (isAdmin) {
        const newVoteInput = document.getElementById('new-vote-input');
        const option1Input = document.getElementById('option1-input');
        const option2Input = document.getElementById('option2-input');

        const newVoteTitle = newVoteInput.value.trim();
        const option1 = option1Input.value.trim();
        const option2 = option2Input.value.trim();

        if (newVoteTitle !== '' && option1 !== '' && option2 !== '') {
            const newVote = {
                id: votes.length + 1,
                title: newVoteTitle,
                options: [
                    { option: option1, count: 0 },
                    { option: option2, count: 0 }
                ]
            };
            votes.push(newVote);
            displayVotes();
            newVoteInput.value = '';
            option1Input.value = '';
            option2Input.value = '';
        }
    } else {
        alert('Only admins can create polls.');
    }
}

function deleteVote(voteId) {
    if (isAdmin) {
        const index = votes.findIndex(vote => vote.id === voteId);
        if (index !== -1) {
            votes.splice(index, 1);
            displayVotes();
        }
    } else {
        alert('Only admins can delete polls.');
    }
}

function vote(option) {
    const voteId = parseInt(document.getElementById('vote-id').value);
    const selectedVote = votes.find(vote => vote.id === voteId);
    if (selectedVote) {
        const hasVoted = votedPolls.includes(voteId);
        if (!hasVoted) {
            const selectedOption = selectedVote.options.find(opt => opt.option === option);
            if (selectedOption) {
                selectedOption.count++;
                const optionCountElement = document.getElementById(`${option.toLowerCase().replace(/\s/g, '')}-count`);
                if (optionCountElement) {
                    optionCountElement.textContent = selectedOption.count;
                }
                votedPolls.push(voteId);
            }
        } else {
            alert('You have already voted in this poll.');
        }
    }
}

function showVoteDetails(vote) {
    const voteDetails = document.getElementById('vote-details');
    voteDetails.innerHTML = `<h3>${vote.title}</h3>`;
    voteDetails.innerHTML += '<div id="vote-counts"></div>';
    const voteCounts = document.getElementById('vote-counts');
    voteCounts.innerHTML = '<h4>Vote Counts:</h4>';
    vote.options.forEach(option => {
        voteCounts.innerHTML += `<p>${option.option}: <span id="${option.option.toLowerCase().replace(/\s/g, '')}-count">${option.count}</span> votes</p>`;
    });
    voteDetails.innerHTML += `<input type="hidden" id="vote-id" value="${vote.id}">`;
    const voteButtons = document.createElement('div');
    voteButtons.innerHTML = `
        <button onclick="vote('${vote.options[0].option}')">Vote for ${vote.options[0].option}</button>
        <button onclick="vote('${vote.options[1].option}')">Vote for ${vote.options[1].option}</button>
    `;
    voteDetails.appendChild(voteButtons);
}

let isAdmin = false;

function login() {
    const usernameInput = document.getElementById('username-input').value;
    const passwordInput = document.getElementById('password-input').value;

    const validUsername = 'admin';
    const validPassword = 'password';

    if (usernameInput === validUsername && passwordInput === validPassword) {
        isAdmin = true;
        document.getElementById('login-container').style.display = 'none';
        document.getElementById('toggle-admin-button').style.display = 'block';
        displayVotes();
    } else {
        alert('Invalid username or password.');
    }
}

function logout() {
    isAdmin = false;
    document.getElementById('login-container').style.display = 'block';
    document.getElementById('toggle-admin-button').style.display = 'none';
    displayVotes();
}

function toggleAdmin() {
    isAdmin = !isAdmin;
    displayVotes();
}

window.onload = function() {
    document.getElementById('login-button').addEventListener('click', login);
    document.getElementById('toggle-admin-button').addEventListener('click', toggleAdmin);
    document.getElementById('create-vote-button').addEventListener('click', createVote);
};
