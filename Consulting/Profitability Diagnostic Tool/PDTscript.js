document.addEventListener('DOMContentLoaded', function() {
            // DOM Elements
            const analyzeBtn = document.getElementById('analyzeBtn');
            const resetBtn = document.getElementById('resetBtn');
            const metricCards = document.getElementById('metricCards');
            const resultsSection = document.getElementById('resultsSection');
            const scenarioSection = document.getElementById('scenarioSection');
            const insightsCard = document.getElementById('insightsCard');
            
            let profitChart, costChart;
            
            // Initialize charts with placeholder data
            initCharts();
            
            // Event Listeners
            analyzeBtn.addEventListener('click', analyzeProfitability);
            resetBtn.addEventListener('click', resetForm);
            
            function initCharts() {
                const profitCtx = document.getElementById('profitChart').getContext('2d');
                profitChart = new Chart(profitCtx, {
                    type: 'bar',
                    data: {
                        labels: ['Revenue', 'Gross Profit', 'Operating Profit', 'Net Profit'],
                        datasets: [{
                            label: 'Financial Performance ($)',
                            data: [150000, 85000, 30000, 19875],
                            backgroundColor: [
                                'rgba(67, 97, 238, 0.8)',
                                'rgba(46, 204, 113, 0.8)',
                                'rgba(52, 152, 219, 0.8)',
                                'rgba(155, 89, 182, 0.8)'
                            ],
                            borderColor: [
                                'rgba(67, 97, 238, 1)',
                                'rgba(46, 204, 113, 1)',
                                'rgba(52, 152, 219, 1)',
                                'rgba(155, 89, 182, 1)'
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            title: {
                                display: true,
                                text: 'Profitability Flow Analysis',
                                font: {
                                    size: 16
                                }
                            },
                            legend: {
                                display: false
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                grid: {
                                    color: 'rgba(0, 0, 0, 0.05)'
                                }
                            },
                            x: {
                                grid: {
                                    display: false
                                }
                            }
                        }
                    }
                });
                
                const costCtx = document.getElementById('costChart').getContext('2d');
                costChart = new Chart(costCtx, {
                    type: 'doughnut',
                    data: {
                        labels: ['COGS', 'Operating Expenses', 'Marketing', 'RD', 'Interest'],
                        datasets: [{
                            data: [65000, 55000, 18000, 12000, 5000],
                            backgroundColor: [
                                'rgba(247, 37, 133, 0.8)',
                                'rgba(255, 159, 67, 0.8)',
                                'rgba(75, 192, 192, 0.8)',
                                'rgba(153, 102, 255, 0.8)',
                                'rgba(255, 99, 132, 0.8)'
                            ],
                            borderColor: [
                                'rgba(247, 37, 133, 1)',
                                'rgba(255, 159, 67, 1)',
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 99, 132, 1)'
                            ],
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            title: {
                                display: true,
                                text: 'Cost Structure Breakdown',
                                font: {
                                    size: 16
                                }
                            },
                            legend: {
                                position: 'bottom'
                            }
                        }
                    }
                });
            }
            
            function analyzeProfitability() {
                // Show results sections
                metricCards.style.display = 'grid';
                resultsSection.style.display = 'grid';
                scenarioSection.style.display = 'grid';
                insightsCard.style.display = 'block';
                
                // Get input values
                const totalRevenue = parseFloat(document.getElementById('totalRevenue').value) || 0;
                const cogs = parseFloat(document.getElementById('cogs').value) || 0;
                const opex = parseFloat(document.getElementById('opex').value) || 0;
                const marketingSpend = parseFloat(document.getElementById('marketingSpend').value) || 0;
                const rdSpend = parseFloat(document.getElementById('rdSpend').value) || 0;
                const taxRate = parseFloat(document.getElementById('taxRate').value) || 0;
                const interestExpenses = parseFloat(document.getElementById('interestExpenses').value) || 0;
                const otherIncome = parseFloat(document.getElementById('otherIncome').value) || 0;
                const employeeCount = parseInt(document.getElementById('employeeCount').value) || 1;
                
                // Calculate metrics
                const grossProfit = totalRevenue - cogs;
                const grossMargin = (grossProfit / totalRevenue) * 100;
                const operatingProfit = grossProfit - opex;
                const operatingMargin = (operatingProfit / totalRevenue) * 100;
                const netProfitBeforeTax = operatingProfit + otherIncome - interestExpenses;
                const netProfit = netProfitBeforeTax * (1 - taxRate / 100);
                const netMargin = (netProfit / totalRevenue) * 100;
                const profitPerEmployee = netProfit / employeeCount;
                
                // Break-even calculations
                const fixedCosts = opex + interestExpenses;
                const variableCostRatio = cogs / totalRevenue;
                const contributionMargin = 1 - variableCostRatio;
                const breakEvenRevenue = fixedCosts / contributionMargin;
                const avgRevenuePerCustomer = totalRevenue / (document.getElementById('customerCount').value || 1);
                const breakEvenCustomers = breakEvenRevenue / avgRevenuePerCustomer;
                const monthlyTarget = breakEvenRevenue / 12;
                
                // Growth projections (15% annual growth)
                const year1Revenue = totalRevenue * 1.15;
                const year1Profit = netProfit * 1.25; // Assuming improved margins
                const year3Revenue = totalRevenue * Math.pow(1.15, 3);
                const year3Profit = netProfit * Math.pow(1.25, 3);
                
                // Update metric cards
                document.getElementById('grossProfit').textContent = formatCurrency(grossProfit);
                document.getElementById('operatingProfit').textContent = formatCurrency(operatingProfit);
                document.getElementById('netProfit').textContent = formatCurrency(netProfit);
                document.getElementById('profitPerEmployee').textContent = formatCurrency(profitPerEmployee);
                
                // Update scenario section
                document.getElementById('breakEvenRevenue').textContent = formatCurrency(breakEvenRevenue);
                document.getElementById('breakEvenCustomers').textContent = Math.ceil(breakEvenCustomers).toLocaleString();
                document.getElementById('monthlyTarget').textContent = formatCurrency(monthlyTarget);
                
                // Update growth projections
                document.getElementById('currentRevenue').textContent = formatCurrency(totalRevenue);
                document.getElementById('currentProfit').textContent = formatCurrency(netProfit);
                document.getElementById('year1Revenue').textContent = formatCurrency(year1Revenue);
                document.getElementById('year1Profit').textContent = formatCurrency(year1Profit);
                document.getElementById('year3Revenue').textContent = formatCurrency(year3Revenue);
                document.getElementById('year3Profit').textContent = formatCurrency(year3Profit);
                
                // Update charts with new data
                updateCharts(totalRevenue, grossProfit, operatingProfit, netProfit, cogs, opex, marketingSpend, rdSpend, interestExpenses);
                
                // Scroll to results
                resultsSection.scrollIntoView({ behavior: 'smooth' });
            }
            
            function updateCharts(revenue, grossProfit, operatingProfit, netProfit, cogs, opex, marketing, rd, interest) {
                // Update profit flow chart
                profitChart.data.datasets[0].data = [
                    revenue,
                    grossProfit,
                    operatingProfit,
                    netProfit
                ];
                profitChart.update();
                
                // Update cost breakdown chart
                costChart.data.datasets[0].data = [
                    cogs,
                    opex - marketing - rd,
                    marketing,
                    rd,
                    interest
                ];
                costChart.data.labels = [
                    'COGS',
                    'Operations',
                    'Marketing',
                    'RD',
                    'Interest'
                ];
                costChart.update();
            }
            
            function resetForm() {
                // Reset all inputs to default values
                document.getElementById('totalRevenue').value = '150000';
                document.getElementById('recurringRevenue').value = '45';
                document.getElementById('growthRate').value = '12';
                document.getElementById('customerCount').value = '1250';
                document.getElementById('avgRevenue').value = '120';
                document.getElementById('cogs').value = '65000';
                document.getElementById('opex').value = '55000';
                document.getElementById('marketingSpend').value = '18000';
                document.getElementById('rdSpend').value = '12000';
                document.getElementById('employeeCount').value = '15';
                document.getElementById('taxRate').value = '25';
                document.getElementById('interestExpenses').value = '5000';
                document.getElementById('otherIncome').value = '3500';
                document.getElementById('industry').value = 'manufacturing';
                document.getElementById('businessSize').value = 'medium';
                
                // Hide results sections
                metricCards.style.display = 'none';
                resultsSection.style.display = 'none';
                scenarioSection.style.display = 'none';
                insightsCard.style.display = 'none';
            }
            
            function formatCurrency(amount) {
                return new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                }).format(amount);
            }
            
            // Initialize with default analysis
            setTimeout(() => {
                analyzeBtn.classList.add('highlight');
            }, 1000);
        });