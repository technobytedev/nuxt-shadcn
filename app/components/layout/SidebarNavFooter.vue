<script setup lang="ts">
import { useSidebar } from '~/components/ui/sidebar'
import { toast } from 'vue-sonner'

const { user, signOut } = useAuth()
const { isMobile, setOpenMobile } = useSidebar()

// Compute user display data from Supabase user
const userData = computed(() => {
  if (!user.value) {
    return {
      name: 'Guest',
      email: 'guest@example.com',
      avatar: '',
      initials: 'G',
    }
  }

  // Get name from user metadata or email
  const fullName = user.value.user_metadata?.full_name 
    || user.value.user_metadata?.name
    || user.value.email?.split('@')[0]
    || 'User'

  // Get avatar from user metadata (Google provides this)
  const avatar = user.value.user_metadata?.avatar_url 
    || user.value.user_metadata?.picture
    || ''

  // Generate initials from name
  const initials = fullName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return {
    name: fullName,
    email: user.value.email || 'No email',
    avatar,
    initials,
  }
})

async function handleLogout() {
  try {
    await signOut()
    toast.success('Logged out successfully')
    // signOut() will automatically redirect to /login
  }
  catch (error: any) {
    console.error('Logout error:', error)
    toast.error('Failed to log out', {
      description: error.message || 'Please try again',
    })
  }
}

const showModalTheme = ref(false)
</script>

<template>
  <SidebarMenu>
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <SidebarMenuButton
            size="lg"
            class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
          >
            <Avatar class="h-8 w-8 rounded-lg">
              <AvatarImage :src="userData.avatar" :alt="userData.name" />
              <AvatarFallback class="rounded-lg">
                {{ userData.initials }}
              </AvatarFallback>
            </Avatar>
            <div class="grid flex-1 text-left text-sm leading-tight">
              <span class="truncate font-semibold">{{ userData.name }}</span>
              <span class="truncate text-xs">{{ userData.email }}</span>
            </div>
            <Icon name="i-lucide-chevrons-up-down" class="ml-auto size-4" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          class="min-w-56 w-[--radix-dropdown-menu-trigger-width] rounded-lg"
          :side="isMobile ? 'bottom' : 'right'"
          align="end"
        >
          <DropdownMenuLabel class="p-0 font-normal">
            <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
              <Avatar class="h-8 w-8 rounded-lg">
                <AvatarImage :src="userData.avatar" :alt="userData.name" />
                <AvatarFallback class="rounded-lg">
                  {{ userData.initials }}
                </AvatarFallback>
              </Avatar>
              <div class="grid flex-1 text-left text-sm leading-tight">
                <span class="truncate font-semibold">{{ userData.name }}</span>
                <span class="truncate text-xs">{{ userData.email }}</span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Icon name="i-lucide-sparkles" />
              Upgrade to Pro
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Icon name="i-lucide-badge-check" />
              Account
            </DropdownMenuItem>
            <DropdownMenuItem as-child>
              <NuxtLink to="/settings" @click="setOpenMobile(false)">
                <Icon name="i-lucide-settings" />
                Settings
              </NuxtLink>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Icon name="i-lucide-bell" />
              Notifications
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem as-child>
              <NuxtLink to="https://github.com/dianprata/nuxt-shadcn-dashboard" external target="_blank">
                <Icon name="i-lucide-github" />
                Github Repository
              </NuxtLink>
            </DropdownMenuItem>
            <DropdownMenuItem @click="showModalTheme = true">
              <Icon name="i-lucide-paintbrush" />
              Theme
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem @click="handleLogout">
            <Icon name="i-lucide-log-out" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  </SidebarMenu>

  <Dialog v-model:open="showModalTheme">
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Customize</DialogTitle>
        <DialogDescription class="text-xs text-muted-foreground">
          Customize & Preview in Real Time
        </DialogDescription>
      </DialogHeader>
      <ThemeCustomize />
    </DialogContent>
  </Dialog>
</template>