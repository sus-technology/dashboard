import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { mockTemplates } from '@/lib/mockData';
import { containerVariants, cardVariants } from '@/lib/animations';
import { cn } from '@/lib/utils';

const categories = ['All', 'E-commerce', 'Chat', 'Booking', 'Social', 'Utility'] as const;

export default function Templates() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const filteredTemplates = mockTemplates.filter(template => {
    const matchesCategory = selectedCategory === 'All' || template.category === selectedCategory;
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) || template.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <div>
        <h2 className="font-heading text-2xl">Templates</h2>
        <p className="text-muted-foreground">Choose a template to start building your app</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search templates..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-10" />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-thin">
          {categories.map((category) => (
            <Button key={category} variant={selectedCategory === category ? 'default' : 'outline'} size="sm" onClick={() => setSelectedCategory(category)} className={cn('flex-shrink-0', selectedCategory === category && 'bg-primary text-primary-foreground')}>
              {category}
            </Button>
          ))}
        </div>
      </div>

      <motion.div variants={containerVariants} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((template) => (
          <motion.div key={template.id} variants={cardVariants} whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }} onClick={() => setSelectedTemplate(template.id)} className={cn('bg-card border rounded-xl overflow-hidden cursor-pointer transition-all duration-200', selectedTemplate === template.id ? 'border-primary glow-primary' : 'border-border hover:border-primary/50')}>
            <div className="aspect-video bg-muted relative overflow-hidden">
              <img
                src={template.preview}
                alt={template.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3"><span className="px-2 py-1 rounded-md bg-background/80 backdrop-blur-sm text-xs font-medium">{template.category}</span></div>
            </div>
            <div className="p-4">
              <h3 className="font-heading text-lg mb-1">{template.name}</h3>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{template.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-sm text-muted-foreground"><Users className="h-4 w-4" />{template.usageCount.toLocaleString()} uses</div>
                <Button size="sm" variant={selectedTemplate === template.id ? 'gradient' : 'outline'}>{selectedTemplate === template.id ? 'Selected' : 'Use Template'}</Button>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>
      {filteredTemplates.length === 0 && <div className="py-12 text-center"><p className="text-muted-foreground">No templates found matching your criteria</p></div>}
    </motion.div>
  );
}
