const canvas = document.getElementById("myChart");
const ctx = document.getElementById("myChart").getContext("2d");
const users = parseInt(canvas.getAttribute("data-users"));
const stories = parseInt(canvas.getAttribute("data-stories"));
const comments = parseInt(canvas.getAttribute("data-comments"));
const categories = parseInt(canvas.getAttribute("data-categories"));
const data = {
	labels: ["Users", "Stories", "Comments", "Categories"],
	datasets: [
		{
			label: "Statistics",
			data: [users, stories, comments, categories],
			backgroundColor: ["#3498db", "#2ecc71", "#f1c40f", "#e74c3c"],
			borderColor: ["#2980b9", "#27ae60", "#f39c12", "#c0392b"],
			borderWidth: 1,
		},
	],
};

const config = {
	type: "doughnut",
	data: data,
	options: {
		responsive: true,
		plugins: {
			legend: {
				position: "top",
			},
			tooltip: {
				callbacks: {
					label: function (tooltipItem) {
						let value = tooltipItem.raw;
						let total = data.datasets[0].data.reduce(
							(a, b) => a + b,
							0
						);
						let percentage = ((value / total) * 100).toFixed(2);
						return `${tooltipItem.label}: ${percentage}% (${value})`;
					},
				},
			},
			datalabels: {
				color: "#fff",
				anchor: "end",
				align: "start",
				offset: 10,
				formatter: function (value, context) {
					let total = context.chart.data.datasets[0].data.reduce(
						(a, b) => a + b,
						0
					);
					let percentage = ((value / total) * 100).toFixed(2);
					return `${percentage}% (${value})`;
				},
			},
		},
	},
	plugins: [ChartDataLabels],
};

new Chart(ctx, config);
