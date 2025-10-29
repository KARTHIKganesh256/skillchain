import React from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  Star, 
  Zap, 
  Trophy, 
  Target, 
  CheckCircle,
  Play,
  Award,
  Flame
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card.tsx';
import { Badge } from '../ui/badge.tsx';
import { Button } from '../ui/button.tsx';
import { Progress } from '../ui/progress.tsx';
import type { Task, UserProgress } from '../../lib/taskEngine.ts';

interface TaskCardProps {
  task: Task;
  userProgress: UserProgress;
  onStart: (taskId: string) => void;
  onComplete: (taskId: string) => void;
  isCompleted?: boolean;
  isInProgress?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  userProgress,
  onStart,
  onComplete,
  isCompleted = false,
  isInProgress = false
}) => {
  const difficultyColors = {
    beginner: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    intermediate: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    advanced: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    expert: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
  };

  const difficultyIcons = {
    beginner: '🌱',
    intermediate: '🌿',
    advanced: '🌳',
    expert: '🏆'
  };

  const streakMultiplier = Math.min(1 + (userProgress.currentStreak * 0.1), 2.0);
  const totalCoins = Math.round(task.coinReward * streakMultiplier);
  const totalXP = Math.round(task.xpReward * streakMultiplier);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <Card className={`h-full transition-all duration-300 ${
        isCompleted 
          ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
          : isInProgress
          ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800'
          : 'hover:shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm group-hover:bg-gradient-to-br group-hover:from-blue-50 group-hover:to-purple-50 dark:group-hover:from-gray-800 dark:group-hover:to-gray-700'
      }`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <CardTitle className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                {task.title}
              </CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {task.description}
              </p>
            </div>
            <div className="flex flex-col items-end space-y-2">
              <Badge className={difficultyColors[task.difficulty]}>
                {difficultyIcons[task.difficulty]} {task.difficulty}
              </Badge>
              {task.isDaily && (
                <Badge variant="outline" className="text-xs">
                  <Flame className="w-3 h-3 mr-1" />
                  Daily
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          {/* Skill Tags */}
          <div className="flex flex-wrap gap-1 mb-4">
            {task.skillTags.map((skill, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>

          {/* Task Stats */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {task.estimatedTime} min
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Target className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {task.verificationType}
              </span>
            </div>
          </div>

          {/* Rewards */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg p-3 mb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {totalXP} XP
                  </span>
                </div>
                <div className="flex items-center space-x-1">
                  <Zap className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {totalCoins} Coins
                  </span>
                </div>
              </div>
              {userProgress.currentStreak > 0 && (
                <div className="flex items-center space-x-1 text-xs text-orange-600">
                  <Trophy className="w-3 h-3" />
                  <span>+{Math.round((totalXP + totalCoins) * 0.1 * userProgress.currentStreak)} streak bonus</span>
                </div>
              )}
            </div>
          </div>

          {/* Completion Rate */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-gray-600 dark:text-gray-400">Completion Rate</span>
              <span className="text-gray-900 dark:text-gray-100 font-medium">
                {Math.round(task.completionRate * 100)}%
              </span>
            </div>
            <Progress value={task.completionRate * 100} className="h-2" />
          </div>

          {/* Requirements */}
          <div className="mb-4">
            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">
              Requirements:
            </h4>
            <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
              {task.requirements.slice(0, 2).map((req, index) => (
                <li key={index} className="flex items-center space-x-1">
                  <div className="w-1 h-1 bg-gray-400 rounded-full" />
                  <span>{req}</span>
                </li>
              ))}
              {task.requirements.length > 2 && (
                <li className="text-gray-500">
                  +{task.requirements.length - 2} more...
                </li>
              )}
            </ul>
          </div>

          {/* Action Button */}
          <div className="flex space-x-2">
            {isCompleted ? (
              <Button className="w-full bg-green-600 hover:bg-green-700" disabled>
                <CheckCircle className="w-4 h-4 mr-2" />
                Completed
              </Button>
            ) : isInProgress ? (
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700"
                onClick={() => onComplete(task.id)}
              >
                <Award className="w-4 h-4 mr-2" />
                Mark Complete
              </Button>
            ) : (
              <Button 
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                onClick={() => onStart(task.id)}
              >
                <Play className="w-4 h-4 mr-2" />
                Start Task
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default TaskCard;
