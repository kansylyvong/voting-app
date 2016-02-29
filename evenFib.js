function fib() {
	var arr = [1, 2];
	var sum = 2;
	for (var i = 1; i < 100; i++) {
		var term = arr[i] + arr[i-1]
		if (term >= 4000000) break;
		arr.push(term);
		if ((term % 2) === 0) sum+=term;
	}
	console.log(sum);
};

fib();
