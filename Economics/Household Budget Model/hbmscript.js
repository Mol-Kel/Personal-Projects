const budget = {
    income: [],
    expenses: [],
    savingsGoals: []
};

function switchTab(tabName) {
    document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach((c) => c.classList.remove("active"));

    event.target.classList.add("active");
    document.getElementById(tabName).classList.add("active");
}

function formatCurrency(amount) {
    return "R" + parseFloat(amount).toFixed(2);
}

function updateDashboard() {
    const totalIncome = budget.income.reduce((sum, item) => sum + parseFloat(item.amount), 0);
    const totalExpenses = budget.expenses.reduce((sum, item) => sum + parseFloat(item.amount), 0);
    const balance = totalIncome - totalExpenses;

    document.getElementById("totalIncome").textContent = formatCurrency(totalIncome);
    document.getElementById("totalExpenses").textContent = formatCurrency(totalExpenses);
    document.getElementById("balance").textContent = formatCurrency(balance);

    updateCategoryChart();
    updateReports();
}

function addIncome() {
    const name = document.getElementById("incomeName").value;
    const amount = document.getElementById("incomeAmount").value;

    if (!name || !amount || amount <= 0) {
        alert("Please enter valid income details");
        return;
    }

    budget.income.push({ name, amount: parseFloat(amount) });

    document.getElementById("incomeName").value = "";
    document.getElementById("incomeAmount").value = "";

    renderIncome();
    updateDashboard();
}

function renderIncome() {
    const list = document.getElementById("incomeList");
    list.innerHTML = "";

    budget.income.forEach((item, index) => {
        const div = document.createElement("div");
        div.className = "item";
        div.innerHTML = `
                    <div class="item-info">
                        <div class="item-name">${item.name}</div>
                    </div>
                    <div class="item-amount">${formatCurrency(item.amount)}</div>
                    <button class="btn btn-small btn-danger" onclick="removeIncome(${index})">Remove</button>
                `;
        list.appendChild(div);
    });
}

function removeIncome(index) {
    budget.income.splice(index, 1);
    renderIncome();
    updateDashboard();
}

function addExpense() {
    const name = document.getElementById("expenseName").value;
    const amount = document.getElementById("expenseAmount").value;
    const category = document.getElementById("expenseCategory").value;

    if (!name || !amount || amount <= 0) {
        alert("Please enter valid expense details");
        return;
    }

    budget.expenses.push({ name, amount: parseFloat(amount), category });

    document.getElementById("expenseName").value = "";
    document.getElementById("expenseAmount").value = "";

    renderExpenses();
    updateDashboard();
}

function renderExpenses() {
    const list = document.getElementById("expenseList");
    list.innerHTML = "";

    budget.expenses.forEach((item, index) => {
        const div = document.createElement("div");
        div.className = "item expense";
        div.innerHTML = `
                    <div class="item-info">
                        <div class="item-name">${item.name}</div>
                        <div class="item-category">${item.category}</div>
                    </div>
                    <div class="item-amount">${formatCurrency(item.amount)}</div>
                    <button class="btn btn-small btn-danger" onclick="removeExpense(${index})">Remove</button>
                `;
        list.appendChild(div);
    });
}

function removeExpense(index) {
    budget.expenses.splice(index, 1);
    renderExpenses();
    updateDashboard();
}

function updateCategoryChart() {
    const categoryTotals = {};

    budget.expenses.forEach((expense) => {
        if (!categoryTotals[expense.category]) {
            categoryTotals[expense.category] = 0;
        }
        categoryTotals[expense.category] += parseFloat(expense.amount);
    });

    const chart = document.getElementById("categoryChart");
    chart.innerHTML = "";

    const maxAmount = Math.max(...Object.values(categoryTotals), 1);

    Object.entries(categoryTotals).forEach(([category, amount]) => {
        const height = (amount / maxAmount) * 250;
        const bar = document.createElement("div");
        bar.className = "bar";
        bar.style.height = height + "px";
        bar.innerHTML = `
                    <div class="bar-value">${formatCurrency(amount)}</div>
                    <div class="bar-label">${category}</div>
                `;
        chart.appendChild(bar);
    });
}

function addSavingsGoal() {
    const name = document.getElementById("goalName").value;
    const target = document.getElementById("goalTarget").value;
    const current = document.getElementById("goalCurrent").value;

    if (!name || !target || target <= 0) {
        alert("Please enter valid goal details");
        return;
    }

    budget.savingsGoals.push({
        name,
        target: parseFloat(target),
        current: parseFloat(current) || 0
    });

    document.getElementById("goalName").value = "";
    document.getElementById("goalTarget").value = "";
    document.getElementById("goalCurrent").value = "";

    renderSavingsGoals();
}

function renderSavingsGoals() {
    const list = document.getElementById("savingsGoalsList");
    list.innerHTML = "";

    budget.savingsGoals.forEach((goal, index) => {
        const percentage = Math.min((goal.current / goal.target) * 100, 100);
        const div = document.createElement("div");
        div.className = "savings-goal";
        div.innerHTML = `
                    <div class="savings-goal-header">
                        <div>
                            <div class="item-name">${goal.name}</div>
                            <div class="item-category">${formatCurrency(goal.current)} / ${formatCurrency(goal.target)}</div>
                        </div>
                        <button class="btn btn-small btn-danger" onclick="removeGoal(${index})">Remove</button>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${percentage}%">${percentage.toFixed(0)}%</div>
                    </div>
                `;
        list.appendChild(div);
    });
}

function removeGoal(index) {
    budget.savingsGoals.splice(index, 1);
    renderSavingsGoals();
}

function updateReports() {
    const totalIncome = budget.income.reduce((sum, item) => sum + parseFloat(item.amount), 0);
    const totalExpenses = budget.expenses.reduce((sum, item) => sum + parseFloat(item.amount), 0);
    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

    document.getElementById("savingsRate").textContent = savingsRate.toFixed(1) + "%";

    const categoryTotals = {};
    budget.expenses.forEach((expense) => {
        if (!categoryTotals[expense.category]) {
            categoryTotals[expense.category] = 0;
        }
        categoryTotals[expense.category] += parseFloat(expense.amount);
    });

    const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);

    if (sortedCategories.length > 0) {
        document.getElementById("largestExpense").textContent = sortedCategories[0][0];
    } else {
        document.getElementById("largestExpense").textContent = "-";
    }

    document.getElementById("totalCategories").textContent = Object.keys(categoryTotals).length;
    document.getElementById("avgDaily").textContent = formatCurrency(totalExpenses / 30);

    const breakdown = document.getElementById("categoryBreakdown");
    breakdown.innerHTML = "";

    sortedCategories.forEach(([category, amount]) => {
        const percentage = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
        const div = document.createElement("div");
        div.className = "savings-goal";
        div.innerHTML = `
                    <div class="savings-goal-header">
                        <div>
                            <div class="item-name">${category}</div>
                            <div class="item-category">${formatCurrency(amount)}</div>
                        </div>
                    </div>
                    <div class="progress-bar">
                        <div class="progress-fill ${percentage > 50 ? "overspent" : ""}" style="width: ${percentage}%">${percentage.toFixed(1)}%</div>
                    </div>
                `;
        breakdown.appendChild(div);
    });
}

updateDashboard();
