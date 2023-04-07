<script lang="ts">
  import { createEventDispatcher, onMount, onDestroy } from "svelte";

    export let count: number = 0;
    export let loading: boolean = false;
    type $$Props = HTMLElementTagNameMap['button'] & {
        count: number;
        loading: boolean;
    };

    type $$Slots = {
        default: {
            count: number;
        }
        iconLeft: {
            count1: number
        }
    }

    function clickOutside(node) {
        const handleClick = (event) => {
            if (!node.contains(event.target)) {
                node.dispatchEvent(new CustomEvent("outclick"));
            }
        };

        document.addEventListener("click", handleClick, true);

        return {
            destroy() {
                document.removeEventListener("click", handleClick, true);
            }
        };
    }
    
    onMount(() => {
        console.log('mount, e.g. fetch data')
    })

    onDestroy(() => {
        console.log('cleanup')
    })
    
	const dispatch = createEventDispatcher();
    const handleClick = () => {
        if (count ===3) {
            dispatch('countis3')
        }
    } 

    $: dispatch('countchange', {count: count})
</script>

<button use:clickOutside on:click={handleClick} {...$$restProps}>
    {#if loading}
        Loading....
    {:else}
        <slot name="iconLeft" count1={count} />
        <slot {count} />
    {/if}
</button>