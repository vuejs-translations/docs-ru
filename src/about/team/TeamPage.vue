<script lang="ts">
const shuffleMembers = (members: Member[], pinTheFirstMember = false): void => {
  let offset = pinTheFirstMember ? 1 : 0
  // `i` is between `1` and `length - offset`
  // `j` is between `0` and `length - offset - 1`
  // `offset + i - 1` is between `offset` and `length - 1`
  // `offset + j` is between `offset` and `length - 1`
  let i = members.length - offset
  while (i > 0) {
    const j = Math.floor(Math.random() * i);
    [
      members[offset + i - 1],
      members[offset + j]
    ] = [
      members[offset + j],
      members[offset + i - 1]
    ]
    i--
  }
}
</script>

<script setup lang="ts">
import { VTLink } from '@vue/theme'
import membersCoreData from './members-core.json'
import membersEmeritiData from './members-emeriti.json'
import membersPartnerData from './members-partner.json'
import TeamHero from './TeamHero.vue'
import TeamList from './TeamList.vue'
import type { Member } from './Member'
shuffleMembers(membersCoreData as Member[], true)
shuffleMembers(membersEmeritiData as Member[])
shuffleMembers(membersPartnerData as Member[])
</script>

<template>
  <div class="TeamPage">
    <TeamHero>
      <template #title>Знакомство с командой</template>
      <template #lead
        >Развитие Vue и ее экосистемы осуществляется под руководством международной команды, члены которой решили
        <span class="nowrap">рассказать о себе ниже.</span></template
      >

      <template #action>
        <VTLink
          href="https://github.com/vuejs/governance/blob/master/Team-Charter.md"
          >Узнайте больше о командах</VTLink
        >
      </template>
    </TeamHero>

    <TeamList :members="membersCoreData as Member[]">
      <template #title>Члены основной команды</template>
      <template #lead
        >Члены основной команды - это те, кто активно участвует в
        сопровождении одного или нескольких основных проектов. Они внесли значительный
        вклад в экосистему Vue, с долгосрочной приверженностью к
        успеху проекта и его пользователей.</template
      >
    </TeamList>

    <TeamList :members="membersEmeritiData as Member[]">
      <template #title>Почетные члены основной команды</template>
      <template #lead
        >Здесь мы чествуем некоторых уже неактивных членов основной команды, которые внесли
        ценный вклад в прошлом.</template
      >
    </TeamList>

    <TeamList :members="membersPartnerData as Member[]">
      <template #title>Партнеры сообщества</template>
      <template #lead
        >Некоторые члены сообщества Vue настолько обогатили его, что заслуживают особого упоминания.
        Мы наладили более тесные отношения с этими ключевыми партнерами,
        часто согласовывая с ними предстоящие функции и новости.</template
      >
    </TeamList>
  </div>
</template>

<style scoped>
.TeamPage {
  padding-bottom: 16px;
}

@media (min-width: 768px) {
  .TeamPage {
    padding-bottom: 96px;
  }
}

.TeamList + .TeamList {
  padding-top: 64px;
}
</style>
