const getKey = () => {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get(['openai-key'], (result) => {
            if (result['openai-key']) {
                const decodedKey = atob(result['openai-key']);
                resolve(decodedKey);
            }
        });
    });
};

const generate = async (prompt) => {
    // Get your API key from storage
    const key = await getKey();
    const url = 'https://api.openai.com/v1/completions';

    // Call completions endpoint
    const completionResponse = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${key}`,
        },
        body: JSON.stringify({
            model: 'text-davinci-003',
            prompt: prompt,
            max_tokens: 1250,
            temperature: 0.7,
        }),
    });

    // Select the top choice and send back
    const completion = await completionResponse.json();
    return completion.choices.pop();
}
const generateCompletionAction = async (info) => {
    try {
        const { selectionText } = info;
        const basePromptPrefix = `
	A Chat with a President.
	`;
        const baseCompletion = await generate(`${basePromptPrefix}${selectionText}`);

        // Let's see what we get!
        console.log(baseCompletion.text)
    } catch (error) {
        console.log(error);
    }
}


chrome.runtime.onInstalled.addListener(() => {
    chrome.contextMenus.create({
        id: 'context-run',
        title: 'Generate some answers',
        contexts: ['selection'],
    });
});

// Add listener
chrome.contextMenus.onClicked.addListener(generateCompletionAction);


// Function to get + decode API key


