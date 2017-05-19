#! usr/bin/python3


def parse(string):
	result = []
	code = string.split('\n')
	if ('def' in code[0]):
		result.append(code[0])
	# send bot the code
	for (i in range(0, len(code)):
		if ('def' not in code[i]):
			# send code[i]
			# get bot response
			response = ""
			result.append(response)

	return result


	
