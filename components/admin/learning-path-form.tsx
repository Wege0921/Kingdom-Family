'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/lib/supabase/client'
import { learningPathSchema, type LearningPathFormValues } from '@/lib/validations'
import type { LearningPath } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'

export function LearningPathForm({ path }: { path?: LearningPath }) {
  const router = useRouter()
  const { toast } = useToast()
  const [saving, setSaving] = useState(false)

  const form = useForm<LearningPathFormValues>({
    resolver: zodResolver(learningPathSchema),
    defaultValues: {
      title_en: path?.title_en ?? '',
      title_am: path?.title_am ?? '',
      description_en: path?.description_en ?? '',
      description_am: path?.description_am ?? '',
      cover_image: path?.cover_image ?? '',
      difficulty_level: path?.difficulty_level ?? 'beginner',
      estimated_duration_minutes: path?.estimated_duration_minutes ?? undefined,
      sort_order: path?.sort_order ?? 0,
      is_published: path?.is_published ?? false,
    },
  })

  const onSubmit = async (values: LearningPathFormValues) => {
    setSaving(true)
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    const payload = {
      title_en: values.title_en,
      title_am: values.title_am || null,
      description_en: values.description_en || null,
      description_am: values.description_am || null,
      cover_image: values.cover_image || null,
      difficulty_level: values.difficulty_level,
      estimated_duration_minutes: values.estimated_duration_minutes ?? null,
      sort_order: values.sort_order,
      is_published: values.is_published,
      updated_at: new Date().toISOString(),
    }

    try {
      if (path) {
        const { error } = await supabase.from('learning_paths').update(payload).eq('id', path.id)
        if (error) throw error
        toast({ title: 'Learning path updated' })
      } else {
        const { data, error } = await supabase
          .from('learning_paths')
          .insert({
            ...payload,
            created_by: user?.id ?? null,
            created_at: new Date().toISOString(),
          })
          .select('id')
          .single()
        if (error) throw error
        toast({ title: 'Learning path created' })
        router.push(`/admin/learning/${data?.id}`)
      }
      router.refresh()
    } catch (e: unknown) {
      toast({
        title: 'Error',
        description: e instanceof Error ? e.message : 'Save failed',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>Path settings</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="cover_image"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Cover image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="difficulty_level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Difficulty</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="estimated_duration_minutes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Duration (minutes)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={1}
                      value={field.value ?? ''}
                      onChange={(e) =>
                        field.onChange(e.target.value === '' ? undefined : Number(e.target.value))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sort_order"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sort order</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min={0}
                      value={field.value}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="is_published"
              render={({ field }) => (
                <FormItem className="sm:col-span-2 flex items-center justify-between rounded-lg border p-4">
                  <FormLabel>Published on /learn</FormLabel>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Tabs defaultValue="en">
          <TabsList>
            <TabsTrigger value="en">English</TabsTrigger>
            <TabsTrigger value="am">Amharic</TabsTrigger>
          </TabsList>
          <TabsContent value="en" className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="title_en"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description_en"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea rows={5} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
          <TabsContent value="am" className="space-y-4 mt-4">
            <FormField
              control={form.control}
              name="title_am"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description_am"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea rows={5} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
        </Tabs>

        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Save path
          </Button>
        </div>
      </form>
    </Form>
  )
}
