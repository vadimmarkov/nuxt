<template>
    <component :is="component.tag" v-bind="component.attrs">
        <span class="button-3d__outer">
            <span v-if="loading" class="button-3d__spinner">
                <span v-for="index in 8" :key="index" />
            </span>

            <span class="button-3d__inner">
                <span v-if="iconBefore || coinBefore" class="button-3d__icon">
                    <!--                    <BfIcon v-if="iconBefore" :type="iconBefore" />-->
                    <!--                    <Coin v-else-if="coinBefore" :type="coinBefore" />-->
                </span>

                <span v-if="$slots.default" :class="'button-3d__text'">
                    <slot />
                </span>

                <span v-if="iconAfter || coinAfter" class="button-3d__icon">
                    <!--                    <BfIcon v-if="iconAfter" :type="iconAfter" />-->
                    <!--                    <Coin v-else-if="coinAfter" :type="coinAfter" />-->
                </span>
            </span>
        </span>
    </component>
</template>

<script lang="ts" setup>
import { useAttrs, computed, useSlots } from 'vue';

defineOptions({
    name: 'Button3D',
    inheritAttrs: false,
});

const attrs = useAttrs();
const slots = useSlots();

interface IButton3DProps {
    type?: 'button' | 'submit';
    to?: string | object;
    external?: boolean;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'double-line';
    color?: 'blue' | 'red' | 'green' | 'yellow';
    loading?: boolean;
    iconBefore?: string;
    iconAfter?: string;
    coinBefore?: string;
    coinAfter?: string;
    fullwidth?: boolean;
    textAlign?: string;
    customRel?: string;
}
const props = withDefaults(defineProps<IButton3DProps>(), {
    type: 'button',
    size: 'md',
    color: 'blue',
    external: false,
    loading: false,
    fullwidth: false,
    textAlign: 'center',
    customRel: 'noopener noreferrer nofollow',
});

// Computed
const buttonClasses = computed(() => {
    const { size, color, textAlign, loading, fullwidth } = props;

    return [
        attrs.class,
        'button-3d',
        'button-3d_' + size,
        'button-3d_' + color,
        'button-3d_' + textAlign,
        {
            'button-3d_loading': loading,
            'button-3d_fullwidth': fullwidth,
            'button-3d_only-icon': !slots.default,
        },
    ];
});

const buttonAttrs = computed<Record<string, object>>(() => {
    const { to, type, customRel } = props;

    return {
        // Router link
        'router-link': {
            to,
        },
        // External link
        a: {
            target: '_blank',
            href: to,
            rel: customRel,
        },
        // Button
        button: {
            type,
        },
    };
});

const component = computed(() => {
    const { to, external } = props;
    let tag;

    if (to && !external) {
        tag = 'router-link';
    } else if (to && external) {
        tag = 'a';
    } else {
        tag = 'button';
    }

    return {
        tag,
        attrs: Object.assign(
            {},
            attrs,
            { class: buttonClasses.value },
            buttonAttrs.value[tag]
        ),
    };
});
</script>

<style lang="scss" scoped>
@import './Button.scss';

.button-3d {
    @include button-3d;
}

// Colors
@each $color, $props in $button-colors {
    .button-3d_#{$color} {
        @include button-color($props);
    }
}

// Sizes
@each $size, $props in $button-sizes {
    .button-3d_#{$size} {
        @include button-size($props);
    }
}
</style>
