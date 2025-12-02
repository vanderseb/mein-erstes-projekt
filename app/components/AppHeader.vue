<template>
  <header>
      <nav>
        <strong>Mein Logo</strong>
        <ul>
          <li><NuxtLink to="/">Home</NuxtLink></li>
          <li><NuxtLink to="/karriere">Karriere</NuxtLink></li>
          <li><NuxtLink to="/kontakt">Kontakt</NuxtLink></li>
          <li><NuxtLink to="/impressum">Impressum</NuxtLink></li>
        </ul>
      </nav>
  </header>
</template>

<style scoped>
nav { display: flex; align-items: center; justify-content: space-between; background: #eee; padding: 10px; }
ul { display: flex; gap: 15px; list-style: none; }
</style>