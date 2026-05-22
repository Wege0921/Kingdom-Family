'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createClient } from '@/lib/supabase/client'
import { topicSchema, type TopicFormValues } from '@/lib/validations'
import type { Topic } from '@/lib/types'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'

export function TopicForm({ topic }: { topic?: Topic }) {
  const router = useRouter()
  const { toast } = useToast()
  const [saving, setSaving] = useState(false)

  const form = useForm<TopicFormValues>({
    resolver: zodResolver(topicSchema),
    defaultValues: {
      name_en: topic?.name_en ?? '',
      name_am: topic?.name_am ?? '',
    },
  })

  const onSubmit = async (values: TopicFormValues) => {
    setSaving(true)
    const supabase = createClient()
    const payload = {
      name_en: values.name_en,
      name_am: values.name_am || null,
    }

    try {
      if (topic) {
        const { error } = await supabase.from('topics').update(payload).eq('id', topic.id)
        if (error) throw error
        toast({ title: 'Topic updated' })
      } else {
        const { data, error } = await supabase
          .from('topics')
          .insert({ ...payload, created_at: new Date().toISOString() })
          .select('id')
          .single()
        if (error) throw error
        toast({ title: 'Topic created' })
        router.push(`/admin/topics/${data?.id}`)
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 max-w-md">
        <FormField
          control={form.control}
          name="name_en"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name (English)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="name_am"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name (Amharic)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Save topic
          </Button>
        </div>
      </form>
    </Form>
  )
}
