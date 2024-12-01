import Button from './Button.vue';

export default {
    title: 'Figma components/Button',
    tags: ['autodocs'],
};

export const ButtonStory = {
    name: 'Button',
    render: (args) => ({
        components: { Button },
        setup() {
            return { args };
        },
        template: `<Button v-bind="args">{{ args.text }}</Button>`,
    }),
    args: {
        // 👇 The args you need here will depend on your component

        text: 'Button',
        external: false,
        to: 'https://www.google.com/',
        iconBefore: 'top',
        iconAfter: 'top',
        coinBefore: 'usdt',
        coinAfter: 'usdt',
        color: 'blue',
        type: 'button',
        loading: false,
        disabled: false,
        size: 'md',
        fullwidth: false,
    },

    argTypes: {
        text: {
            type: 'string',
        },
        external: {
            type: 'boolean',
        },
        to: {
            type: 'string',
        },
        iconBefore: {
            type: 'string',
        },
        iconAfter: {
            type: 'string',
        },
        coinBefore: {
            type: 'string',
        },
        coinAfter: {
            type: 'string',
        },
        color: {
            control: {
                type: 'radio',
            },
            options: ['blue', 'red', 'green'],
        },
        type: {
            options: ['button', 'submit'],
            control: {
                type: 'radio',
            },
        },
        loading: {
            type: 'boolean',
        },
        disabled: {
            type: 'boolean',
        },
        size: {
            options: ['xs', 'sm', 'md', 'lg', 'double-line'],
            control: {
                type: 'radio',
            },
        },
        fullwidth: {
            type: 'boolean',
        },
    },
};
