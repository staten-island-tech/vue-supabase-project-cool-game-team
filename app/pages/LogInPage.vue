<script>

</script>
<template>
    <form>
        <label>Email:</label>
        <input type="text" v-bind="email">
        <label>Password</label>
        <input type="text" v-bind="Password">
        <button @click="logInRequest">Log In</button>
    </form>
</template>