/**
 * Badminton Buddy - App v1.2.0
 * สุ่มทีมคู่แบดมินตัน
 */

// ===== Model =====
let members = JSON.parse(localStorage.getItem('members')) || [];

// ===== Controller =====
window.onload = updateMemberList;

function addMember() {
    const nameInput = document.getElementById('memberName');
    const name = nameInput.value.trim();
    if (!name) return showToast('กรุณาใส่ชื่อสมาชิก', 'warning');

    if (members.includes(name)) {
        showToast('ชื่อสมาชิกนี้มีอยู่แล้ว', 'error');
    } else {
        members.push(name);
        saveAndUpdate();
        nameInput.value = '';
        showToast(`เพิ่ม "${name}" เรียบร้อย`, 'success');
    }
}

function removeMember(name) {
    members = members.filter(member => member !== name);
    saveAndUpdate();
    showToast(`ลบ "${name}" แล้ว`, 'info');
}

function saveAndUpdate() {
    localStorage.setItem('members', JSON.stringify(members));
    updateMemberList();
}

function shuffleArray(array) {
    return array.sort(() => Math.random() - 0.5);
}

function generateMatches() {
    if (members.length < 4) return showToast('ต้องมีสมาชิกอย่างน้อย 4 คน', 'warning');

    let players = shuffleArray([...members]);
    const matches = [];

    while (players.length) {
        let matchPlayers = players.splice(0, 4);

        if (matchPlayers.length < 4) {
            const needed = 4 - matchPlayers.length;
            const extraPlayers = shuffleArray([...members.filter(p => !matchPlayers.includes(p))]).slice(0, needed);
            matchPlayers = matchPlayers.concat(extraPlayers);
        }

        matches.push({
            team1: matchPlayers.slice(0, 2),
            team2: matchPlayers.slice(2, 4),
        });
    }

    displayMatches(matches);
    showToast(`สุ่มได้ ${matches.length} แมทช์`, 'success');
}

// ===== View =====
function updateMemberList() {
    const memberList = document.getElementById('members');
    const memberCount = document.getElementById('memberCount');
    const emptyState = document.getElementById('emptyState');

    memberList.innerHTML = '';
    memberCount.textContent = members.length;

    if (members.length === 0) {
        emptyState.style.display = 'block';
    } else {
        emptyState.style.display = 'none';
        members.forEach((member, index) => {
            const li = document.createElement('li');
            li.style.animationDelay = `${index * 0.05}s`;

            const memberInfo = document.createElement('div');
            memberInfo.className = 'member-name';

            const avatar = document.createElement('div');
            avatar.className = 'member-avatar';
            avatar.textContent = member.charAt(0).toUpperCase();

            const nameSpan = document.createElement('span');
            nameSpan.textContent = member;

            memberInfo.appendChild(avatar);
            memberInfo.appendChild(nameSpan);

            const removeBtn = document.createElement('button');
            removeBtn.innerHTML = '<span class="material-symbols-rounded" style="font-size:18px">delete</span>';
            removeBtn.onclick = () => removeMember(member);

            li.appendChild(memberInfo);
            li.appendChild(removeBtn);
            memberList.appendChild(li);
        });
    }
}

function displayMatches(matches) {
    const matchList = document.getElementById('matches');
    const matchEmptyState = document.getElementById('matchEmptyState');
    matchList.innerHTML = '';

    if (matches.length === 0) {
        matchEmptyState.style.display = 'block';
    } else {
        matchEmptyState.style.display = 'none';
        matches.forEach((match, index) => {
            const li = document.createElement('li');
            li.style.animationDelay = `${index * 0.1}s`;
            li.innerHTML = `<strong>แมทช์ที่ ${index + 1}</strong>`;
            const ul = document.createElement('ul');

            const team1 = document.createElement('li');
            team1.innerHTML = `<span style="color:#a5b4fc;font-weight:500">ทีม 1:</span> ${match.team1.join(' & ')}`;
            ul.appendChild(team1);

            const team2 = document.createElement('li');
            team2.innerHTML = `<span style="color:#f9a8d4;font-weight:500">ทีม 2:</span> ${match.team2.join(' & ')}`;
            ul.appendChild(team2);

            li.appendChild(ul);
            matchList.appendChild(li);
        });
    }
}

function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    const colors = {
        success: '#22c55e',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#6366f1'
    };
    toast.style.borderLeft = `4px solid ${colors[type] || colors.info}`;
    toast.textContent = message;
    toast.className = 'show';
    setTimeout(() => { toast.className = toast.className.replace('show', ''); }, 3000);
}

